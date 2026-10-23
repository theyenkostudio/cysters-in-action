import { NextRequest, NextResponse } from 'next/server'
import { StoryDecisionEmail } from '@/lib/email/templates/story-decision'
import { sendEmail } from '@/lib/email/send'
import { getStoryContactDetails } from '@/lib/sanity/content'
import { siteUrl } from '@/lib/seo'

// Called from the Studio custom actions (sanity/actions/storyActions.tsx),
// client-side, after Approve & publish / Reject. The real trust boundary
// here is Sanity Studio's own auth — only an authenticated editor/moderator
// with dataset access can reach the action button that calls this at all.
// "On approval or rejection, an optional templated email" (Section 7) — a
// failure here never blocks the publish/reject itself, which already happened.
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { storyId?: string; decision?: 'approved' | 'rejected' }
    if (!body.storyId || (body.decision !== 'approved' && body.decision !== 'rejected')) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    const story = await getStoryContactDetails(body.storyId)
    if (!story?.contactEmail || !story.consentContact) {
      return NextResponse.json({ sent: false, reason: 'No contact consent on file' })
    }

    const storyUrl =
      body.decision === 'approved' && story.slug
        ? `${siteUrl}/connect/stories/${story.slug}`
        : undefined

    await sendEmail({
      to: story.contactEmail,
      subject: body.decision === 'approved' ? 'Your story is live' : 'An update on your story',
      react: StoryDecisionEmail({
        name: story.isAnonymous ? undefined : story.authorName,
        decision: body.decision,
        storyUrl,
      }),
    })

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error('[story-decision] failed', err)
    return NextResponse.json({ sent: false }, { status: 500 })
  }
}
