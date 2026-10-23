'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { subscribeToNewsletter } from '@/lib/forms/actions'
import { newsletterSchema, type NewsletterInput } from '@/lib/forms/schemas'
import { FieldError } from './field-error'
import { FormError, FormSuccess } from './form-status'
import { TurnstileWidget } from './turnstile-widget'

export function NewsletterForm({
  source,
  buttonLabel = 'Subscribe',
  successMessage,
  compact = false,
  onSuccess,
}: {
  source: NewsletterInput['source']
  buttonLabel?: string
  successMessage?: string
  compact?: boolean
  onSuccess?: () => void
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { source, honeypot: '', turnstileToken: '' },
  })
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)

  const onSubmit = handleSubmit(async (data) => {
    setStatus(null)
    const result = await subscribeToNewsletter(data)
    if (result.success) {
      setStatus({ success: true, message: successMessage || result.message })
      onSuccess?.()
    } else {
      setStatus({ success: false, message: result.error })
    }
  })

  if (status?.success) return <FormSuccess message={status.message} />

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <div className={compact ? 'flex gap-2' : 'space-y-3'}>
        <div className="flex-1">
          <label htmlFor={`newsletter-email-${source}`} className="sr-only">
            Email address
          </label>
          <Input
            id={`newsletter-email-${source}`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={compact ? 'flex-shrink-0' : 'w-full'}
        >
          {isSubmitting ? 'Subscribing…' : buttonLabel}
        </Button>
      </div>

      {/* Honeypot — hidden from sighted users, bots fill every field */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
        {...register('honeypot')}
      />
      <TurnstileWidget onToken={(token) => setValue('turnstileToken', token)} />

      {status && !status.success && <FormError message={status.message} />}
    </form>
  )
}
