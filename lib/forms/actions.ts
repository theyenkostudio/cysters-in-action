'use server'

import { headers } from 'next/headers'
import { ContactAutoReplyEmail } from '@/lib/email/templates/contact-auto-reply'
import { ContactNotificationEmail } from '@/lib/email/templates/contact-notification'
import { NewsletterConfirmationEmail } from '@/lib/email/templates/newsletter-confirmation'
import { sendEmail } from '@/lib/email/send'
import { getContactPage } from '@/lib/sanity/content'
import { sanityCreate } from '@/lib/sanity/write'
import { contactSchema, newsletterSchema } from './schemas'
import { getEmailProvider } from './email-provider'
import { checkRateLimit, hashIp } from './rate-limit'
import { verifyTurnstile } from './turnstile'

export type ActionResult = { success: true; message: string } | { success: false; error: string }

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
