'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AddToCalendarMenu } from './add-to-calendar-menu'
import { FieldError } from '@/components/forms/field-error'
import { FormError, FormSuccess } from '@/components/forms/form-status'
import { TurnstileWidget } from '@/components/forms/turnstile-widget'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea } from '@/components/ui/input'
import { submitRsvp } from '@/lib/forms/actions'
import { rsvpSchema, type RsvpInput } from '@/lib/forms/schemas'
import type { EventRef } from '@/lib/sanity/types'

export function RsvpForm({
  event,
  capacityRemaining,
}: {
  event: EventRef
  capacityRemaining?: number
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      eventId: event._id,
      attendance: 'attending',
      consentNewsletter: false,
      honeypot: '',
      turnstileToken: '',
    },
  })
  const [result, setResult] = useState<{
    success: boolean
    message: string
    joinUrl?: string
    waitlisted?: boolean
  } | null>(null)

  const onSubmit = handleSubmit(async (data) => {
    setResult(null)
    const res = await submitRsvp(data)
    setResult(
      res.success
        ? { success: true, message: res.message, joinUrl: res.joinUrl, waitlisted: res.waitlisted }
        : { success: false, message: res.error },
    )
  })

  if (result?.success) {
    return (
      <div className="space-y-4">
        <FormSuccess message={result.message} />
        {result.joinUrl && (
          <p className="rounded-card bg-muted text-fg p-4 text-sm">
            Join link:{' '}
            <a href={result.joinUrl} className="text-fg-link underline">
              {result.joinUrl}
            </a>
          </p>
        )}
        {!result.waitlisted && <AddToCalendarMenu event={event} />}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {typeof capacityRemaining === 'number' && (
        <p className="text-fg-muted text-sm">
          {capacityRemaining > 0
            ? `${capacityRemaining} spot${capacityRemaining === 1 ? '' : 's'} left`
            : 'This event is at capacity — you can still join the waitlist.'}
        </p>
      )}

      <input type="hidden" {...register('eventId')} />

      <div>
        <Label htmlFor="rsvp-name">Name</Label>
        <Input id="rsvp-name" autoComplete="name" {...register('name')} />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <Label htmlFor="rsvp-email">Email</Label>
        <Input id="rsvp-email" type="email" autoComplete="email" {...register('email')} />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label>Attendance</Label>
        <div className="flex gap-4">
          <label className="text-fg flex items-center gap-2 text-sm">
            <input type="radio" value="attending" {...register('attendance')} />
            I’ll be there
          </label>
          <label className="text-fg flex items-center gap-2 text-sm">
            <input type="radio" value="maybe" {...register('attendance')} />
            Maybe
          </label>
        </div>
      </div>

      <div>
        <Label htmlFor="rsvp-questions">Question for the host (optional)</Label>
        <Textarea id="rsvp-questions" rows={3} {...register('questions')} />
      </div>

      <label className="text-fg flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('consentNewsletter')} className="h-4 w-4" />
        Also sign me up for the newsletter
      </label>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
        {...register('honeypot')}
      />
      <TurnstileWidget onToken={(token) => setValue('turnstileToken', token)} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting…' : 'RSVP'}
      </Button>

      {result && !result.success && <FormError message={result.message} />}
    </form>
  )
}
