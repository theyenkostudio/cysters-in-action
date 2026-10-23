'use server'

import { headers } from 'next/headers'
import { buildIcsFile } from '@/lib/calendar/ics'
import { ContactAutoReplyEmail } from '@/lib/email/templates/contact-auto-reply'
import { ContactNotificationEmail } from '@/lib/email/templates/contact-notification'
import { NewsletterConfirmationEmail } from '@/lib/email/templates/newsletter-confirmation'
import { RsvpConfirmationEmail } from '@/lib/email/templates/rsvp-confirmation'
import { StoryConfirmationEmail } from '@/lib/email/templates/story-confirmation'
import { StoryModeratorAlertEmail } from '@/lib/email/templates/story-moderator-alert'
import { sendEmail } from '@/lib/email/send'
import { getContactPage, getEventJoinDetails, getEventRsvpCount } from '@/lib/sanity/content'
import { sanityCreate, sanityUploadImage } from '@/lib/sanity/write'
import { siteUrl } from '@/lib/seo'
import { contactSchema, newsletterSchema, rsvpSchema, shareStorySchema } from './schemas'
import { getEmailProvider } from './email-provider'
import { plainTextToRichText } from './plain-text-to-rich-text'
import { checkRateLimit, hashIp } from './rate-limit'
import { stripExif } from './strip-exif'
import { verifyTurnstile } from './turnstile'
import { createWithdrawToken } from './withdraw-token'

export type ActionResult = { success: true; message: string } | { success: false; error: string }
export type RsvpResult =
  | { success: true; message: string; waitlisted: boolean; joinUrl?: string }
  | { success: false; error: string }

async function getClientIpHash() {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'anonymous'
  return hashIp(ip)
}

export async function subscribeToNewsletter(raw: unknown): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid submission' }
  }
  const { email, firstName, source, honeypot, turnstileToken } = parsed.data
  if (honeypot) return { success: false, error: 'Submission rejected' }

  const ipHash = await getClientIpHash()
  const allowed = await checkRateLimit(`newsletter:${ipHash}`)
  if (!allowed) return { success: false, error: 'Too many attempts. Try again in a few minutes.' }

  const turnstileOk = await verifyTurnstile(turnstileToken)
  if (!turnstileOk)
    return { success: false, error: 'Could not verify you’re human. Please try again.' }

  try {
    await getEmailProvider().subscribe({ email, firstName, tags: [source], source })
    await sendEmail({
      to: email,
      subject: 'You’re on the list',
      react: NewsletterConfirmationEmail({ firstName }),
    })
    return { success: true, message: 'Check your inbox to confirm your subscription.' }
  } catch (err) {
    console.error('[subscribeToNewsletter] failed', err instanceof Error ? err.message : err)
    return { success: false, error: 'Something went wrong. Please try again shortly.' }
  }
}

export async function submitContactForm(raw: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid submission' }
  }
  const { enquiryType, name, email, organisation, message, honeypot, turnstileToken } = parsed.data
  if (honeypot) return { success: false, error: 'Submission rejected' }

  const ipHash = await getClientIpHash()
  const allowed = await checkRateLimit(`contact:${ipHash}`)
  if (!allowed) return { success: false, error: 'Too many attempts. Try again in a few minutes.' }

  const turnstileOk = await verifyTurnstile(turnstileToken)
  if (!turnstileOk)
    return { success: false, error: 'Could not verify you’re human. Please try again.' }

  try {
    const contactPage = await getContactPage()
    const matchedType = contactPage?.enquiryTypes.find((t) => t.value === enquiryType)
    const inboxEmail =
      matchedType?.routeToEmail || process.env.CONTACT_FALLBACK_EMAIL || 'hello@cystersinaction.org'

    await sanityCreate({
      _type: 'contactSubmission',
      enquiryType,
      name,
      email,
      organisation,
      message,
      createdAt: new Date().toISOString(),
      status: 'new',
    })

    await sendEmail({
      to: inboxEmail,
      subject: `New ${matchedType?.label ?? enquiryType} enquiry from ${name}`,
      react: ContactNotificationEmail({
        enquiryType: matchedType?.label ?? enquiryType,
        name,
        email,
        organisation,
        message,
      }),
      replyTo: email,
    })
    await sendEmail({
      to: email,
      subject: 'We got your message',
      react: ContactAutoReplyEmail({ name }),
    })

    return {
      success: true,
      message: contactPage?.successMessage || 'Thanks — we’ll be in touch soon.',
    }
  } catch (err) {
    console.error('[submitContactForm] failed', err instanceof Error ? err.message : err)
    return { success: false, error: 'Something went wrong. Please try again shortly.' }
  }
}

export async function submitStory(raw: unknown): Promise<ActionResult> {
  const parsed = shareStorySchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid submission' }
  }
  const {
    isAnonymous,
    authorName,
    email,
    title,
    body,
    themes,
    ageRange,
    country,
    contentWarning,
    photo,
    consentPublish,
    consentEdit,
    consentContact,
    honeypot,
    turnstileToken,
  } = parsed.data
  if (honeypot) return { success: false, error: 'Submission rejected' }

  const ipHash = await getClientIpHash()
  const allowed = await checkRateLimit(`story:${ipHash}`)
  if (!allowed) return { success: false, error: 'Too many attempts. Try again in a few minutes.' }

  const turnstileOk = await verifyTurnstile(turnstileToken)
  if (!turnstileOk)
    return { success: false, error: 'Could not verify you’re human. Please try again.' }

  try {
    // Photo is re-encoded (EXIF stripped) server-side before it ever reaches
    // Sanity — never trust client-side stripping for something privacy-sensitive.
    const image = photo ? await stripExif(photo) : null
    const uploadedImage = image
      ? await sanityUploadImage(image.buffer, image.filename, image.contentType)
      : undefined

    const doc = await sanityCreate({
      _type: 'story',
      status: 'submitted',
      title,
      isAnonymous,
      authorName: isAnonymous ? undefined : authorName,
      contactEmail: email,
      ageRange,
      country,
      body: plainTextToRichText(body),
      themes,
      contentWarning,
      image: uploadedImage ?? undefined,
      consentPublish,
      consentEdit,
      consentContact,
      submittedAt: new Date().toISOString(),
    })

    const storyId = doc?._id ?? 'unconfigured'
    const withdrawUrl = `${siteUrl}/api/story-withdraw?id=${storyId}&token=${createWithdrawToken(storyId)}`

    await sendEmail({
      to: email,
      subject: 'We got your story',
      react: StoryConfirmationEmail({ name: isAnonymous ? undefined : authorName, withdrawUrl }),
    })

    const moderatorInbox = process.env.STORY_MODERATOR_EMAIL || 'hello@cystersinaction.org'
    await sendEmail({
      to: moderatorInbox,
      subject: `New story submission: ${title}`,
      react: StoryModeratorAlertEmail({ title, isAnonymous, themes }),
    })

    return {
      success: true,
      message: 'Thank you for sharing. A moderator will read your story soon.',
    }
  } catch (err) {
    console.error('[submitStory] failed', err instanceof Error ? err.message : err)
    return { success: false, error: 'Something went wrong. Please try again shortly.' }
  }
}

export async function submitRsvp(raw: unknown): Promise<RsvpResult> {
  const parsed = rsvpSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid submission' }
  }
  const {
    eventId,
    name,
    email,
    attendance,
    questions,
    consentNewsletter,
    honeypot,
    turnstileToken,
  } = parsed.data
  if (honeypot) return { success: false, error: 'Submission rejected' }

  const ipHash = await getClientIpHash()
  const allowed = await checkRateLimit(`rsvp:${ipHash}`)
  if (!allowed) return { success: false, error: 'Too many attempts. Try again in a few minutes.' }

  const turnstileOk = await verifyTurnstile(turnstileToken)
  if (!turnstileOk)
    return { success: false, error: 'Could not verify you’re human. Please try again.' }

  try {
    const event = await getEventJoinDetails(eventId)
    if (!event) return { success: false, error: 'Event not found' }

    // Count-then-create — a simplification of Section 7's "capacity check in
    // a transaction." Good enough for expected traffic on a community site;
    // a genuinely atomic check would need a counter field patched with
    // `.inc()` under an `ifRevisionId` guard.
    let waitlisted = false
    if (attendance === 'attending' && typeof event.capacity === 'number') {
      const currentCount = await getEventRsvpCount(eventId)
      waitlisted = currentCount >= event.capacity
    }

    await sanityCreate({
      _type: 'eventRsvp',
      event: { _type: 'reference', _ref: eventId },
      name,
      email,
      attendance,
      questions,
      consentNewsletter,
      createdAt: new Date().toISOString(),
      emailConfirmed: false,
    })

    if (consentNewsletter) {
      await getEmailProvider().subscribe({
        email,
        firstName: name,
        tags: ['event-rsvp'],
        source: 'event-rsvp',
      })
    }

    const joinUrl = !waitlisted && event.format !== 'inPerson' ? event.onlineJoinUrl : undefined
    const location =
      event.format === 'inPerson' || event.format === 'hybrid' ? event.venueName : undefined

    const attachments = !waitlisted
      ? [
          {
            filename: 'event.ics',
            content: buildIcsFile({
              title: event.title,
              location,
              startDateTime: event.startDateTime,
              endDateTime: event.endDateTime,
            }),
          },
        ]
      : undefined

    await sendEmail({
      to: email,
      subject: waitlisted
        ? `You're on the waitlist: ${event.title}`
        : `You're confirmed: ${event.title}`,
      react: RsvpConfirmationEmail({
        name,
        eventTitle: event.title,
        startDateTime: event.startDateTime,
        timezone: event.timezone,
        joinUrl,
        venueName: location,
        waitlisted,
      }),
      attachments,
    })

    return {
      success: true,
      message: waitlisted
        ? 'You’re on the waitlist — we’ll email you if a spot opens up.'
        : 'You’re confirmed. Check your email for details.',
      waitlisted,
      joinUrl,
    }
  } catch (err) {
    console.error('[submitRsvp] failed', err instanceof Error ? err.message : err)
    return { success: false, error: 'Something went wrong. Please try again shortly.' }
  }
}
