'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { submitContactForm } from '@/lib/forms/actions'
import { contactSchema, type ContactInput } from '@/lib/forms/schemas'
import { FieldError } from './field-error'
import { FormError, FormSuccess } from './form-status'
import { TurnstileWidget } from './turnstile-widget'

export function ContactForm({
  enquiryTypes,
  successMessage,
}: {
  enquiryTypes: { label: string; value: string }[]
  successMessage?: string
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      enquiryType: enquiryTypes[0]?.value ?? '',
      honeypot: '',
      turnstileToken: '',
    },
  })
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)

  const onSubmit = handleSubmit(async (data) => {
    setStatus(null)
    const result = await submitContactForm(data)
    setStatus(
      result.success
        ? { success: true, message: successMessage || result.message }
        : { success: false, message: result.error },
    )
  })

  if (status?.success) return <FormSuccess message={status.message} />

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <Label htmlFor="contact-enquiryType">Enquiry type</Label>
        <Select id="contact-enquiryType" {...register('enquiryType')}>
          {enquiryTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
        <FieldError message={errors.enquiryType?.message} />
      </div>

      <div>
        <Label htmlFor="contact-name">Name</Label>
        <Input id="contact-name" autoComplete="name" {...register('name')} />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <Label htmlFor="contact-email">Email</Label>
        <Input id="contact-email" type="email" autoComplete="email" {...register('email')} />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="contact-organisation">Organisation (optional)</Label>
        <Input
          id="contact-organisation"
          autoComplete="organization"
          {...register('organisation')}
        />
        <FieldError message={errors.organisation?.message} />
      </div>

      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={5} {...register('message')} />
        <FieldError message={errors.message?.message} />
      </div>

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
        {isSubmitting ? 'Sending…' : 'Send message'}
      </Button>

      {status && !status.success && <FormError message={status.message} />}
    </form>
  )
}
