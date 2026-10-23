import { useCallback, useState } from 'react'
import { useDocumentOperation } from 'sanity'
import type { DocumentActionComponent, DocumentActionProps } from 'sanity'
import { slugify } from '@/lib/slugify'

// Studio desk custom actions for the Stories inbox (Section 5): Approve &
// publish / Request changes / Reject. These exist alongside the default
// actions (not replacing them) — see sanity.config.ts's document.actions.

function currentStatus(props: DocumentActionProps): string | undefined {
  return (props.draft?.status ?? props.published?.status) as string | undefined
}

function currentTitle(props: DocumentActionProps): string | undefined {
  return (props.draft?.title ?? props.published?.title) as string | undefined
}

/** Fire-and-forget — a failed notification email never blocks the publish/reject
 * that already happened. See app/api/story-decision/route.ts. */
function notifyDecision(storyId: string, decision: 'approved' | 'rejected') {
  fetch('/api/story-decision', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ storyId, decision }),
  }).catch((err) => console.error('[storyActions] decision email failed', err))
}

export const ApproveAndPublishAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const [isRunning, setIsRunning] = useState(false)

  const handle = useCallback(() => {
    setIsRunning(true)
    const title = currentTitle(props)
    patch.execute([
      {
        set: {
          status: 'approved',
          approvedAt: new Date().toISOString(),
          ...(title ? { slug: { _type: 'slug', current: slugify(title) } } : {}),
        },
      },
    ])
    publish.execute()
    notifyDecision(props.id, 'approved')
    setIsRunning(false)
    props.onComplete()
  }, [patch, publish, props])

  if (props.type !== 'story' || currentStatus(props) === 'approved') return null

  return {
    label: isRunning ? 'Publishing…' : 'Approve & publish',
    tone: 'positive',
    disabled: isRunning || !currentTitle(props),
    onHandle: handle,
  }
}

export const RequestChangesAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type)

  const handle = useCallback(() => {
    patch.execute([{ set: { status: 'changesRequested' } }])
    props.onComplete()
  }, [patch, props])

  if (props.type !== 'story' || currentStatus(props) === 'approved') return null

  return {
    label: 'Request changes',
    tone: 'caution',
    onHandle: handle,
  }
}

export const RejectAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type)
  const [confirming, setConfirming] = useState(false)

  const handle = useCallback(() => {
    patch.execute([{ set: { status: 'rejected' } }])
    notifyDecision(props.id, 'rejected')
    setConfirming(false)
    props.onComplete()
  }, [patch, props])

  if (props.type !== 'story' || currentStatus(props) === 'approved') return null

  return {
    label: 'Reject',
    tone: 'critical',
    onHandle: () => setConfirming(true),
    dialog: confirming && {
      type: 'confirm',
      message:
        'Reject this story? An optional notification email will be sent to the submitter, if they consented to contact.',
      onConfirm: handle,
      onCancel: () => setConfirming(false),
    },
  }
}
