'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FieldError } from '@/components/forms/field-error'
import { FormError, FormSuccess } from '@/components/forms/form-status'
import { TurnstileWidget } from '@/components/forms/turnstile-widget'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { submitStory } from '@/lib/forms/actions'
import { shareStorySchema, type ShareStoryInput } from '@/lib/forms/schemas'

const THEMES = [
  'diagnosis',
  'fertility',
  'mental health',
  'nutrition',
  'work',
  'relationships',
] as const

export function ShareStoryForm({ successMessage }: { successMessage?: string }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShareStoryInput>({
    resolver: zodResolver(shareStorySchema),
    defaultValues: {
      isAnonymous: false,
      themes: [],
      consentPublish: false,
      consentEdit: false,
      consentContact: false,
      honeypot: '',
      turnstileToken: '',
    },
  })
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)
  const isAnonymous = watch('isAnonymous')
  const selectedThemes = watch('themes') ?? []
  const body = watch('body') ?? ''

  const onSubmit = handleSubmit(async (data) => {
    setStatus(null)
    const result = await submitStory(data)
    setStatus(
      result.success
        ? { success: true, message: successMessage || result.message }
        : { success: false, message: result.error },
    )
  })

  if (status?.success) return <FormSuccess message={status.message} />

  function toggleTheme(theme: string) {
    const current = selectedThemes
    setValue(
      'themes',
      current.includes(theme as never)
        ? current.filter((t) => t !== theme)
        : [...current, theme as never],
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate encType="multipart/form-data" className="space-y-6">
      <label className="text-fg flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" {...register('isAnonymous')} className="h-4 w-4" />
        Post anonymously
      </label>

      {!isAnonymous && (
        <div>
          <Label htmlFor="story-authorName">Display name</Label>
          <Input id="story-authorName" {...register('authorName')} />
          <FieldError message={errors.authorName?.message} />
        </div>
      )}

      <div>
        <Label htmlFor="story-email">Email</Label>
        <Input id="story-email" type="email" autoComplete="email" {...register('email')} />
        <p className="text-fg-subtle mt-1 text-xs">
          Private — used only to confirm your submission.
        </p>
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="story-title">Title</Label>
        <Input id="story-title" {...register('title')} />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <Label htmlFor="story-body">Your story</Label>
        <Textarea id="story-body" rows={10} {...register('body')} />
        <p className="text-fg-subtle mt-1 text-xs">{body.length} / 5000 characters (minimum 200)</p>
        <FieldError message={errors.body?.message} />
      </div>

      <div>
        <Label>Themes</Label>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => toggleTheme(theme)}
              aria-pressed={selectedThemes.includes(theme as never)}
              className={
                selectedThemes.includes(theme as never)
                  ? 'rounded-pill border-primary bg-primary text-on-primary border px-3 py-1.5 text-sm font-medium'
                  : 'rounded-pill border-default text-fg hover:bg-muted border px-3 py-1.5 text-sm font-medium'
              }
            >
              #{theme}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="story-ageRange">Age range (optional)</Label>
          <Select id="story-ageRange" {...register('ageRange')}>
            <option value="">Prefer not to say</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55+">55+</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="story-country">Country (optional)</Label>
          <Input id="story-country" {...register('country')} />
        </div>
      </div>

      <div>
        <Label htmlFor="story-photo">Photo (optional, max 5MB, JPG/PNG/HEIC)</Label>
        <input
          id="story-photo"
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif"
          onChange={(e) => setValue('photo', e.target.files?.[0])}
          className="text-fg-muted block w-full text-sm"
        />
        <p className="text-fg-subtle mt-1 text-xs">
          EXIF data (location, device) is stripped automatically.
        </p>
        <FieldError message={errors.photo?.message as string | undefined} />
      </div>

      <div>
        <Label htmlFor="story-contentWarning">Content warning (optional)</Label>
        <Input id="story-contentWarning" {...register('contentWarning')} />
      </div>

      <div className="rounded-card border-default space-y-3 border p-4">
        <label className="text-fg flex items-start gap-2 text-sm">
          <input type="checkbox" {...register('consentPublish')} className="mt-0.5 h-4 w-4" />I
          consent to this story being published on the Cysters In Action website.
        </label>
        <FieldError message={errors.consentPublish?.message} />
        <label className="text-fg flex items-start gap-2 text-sm">
          <input type="checkbox" {...register('consentEdit')} className="mt-0.5 h-4 w-4" />
          I’m okay with light editing for clarity (moderators will check with me on anything
          bigger).
        </label>
        <label className="text-fg flex items-start gap-2 text-sm">
          <input type="checkbox" {...register('consentContact')} className="mt-0.5 h-4 w-4" />
          Moderators may contact me about my submission.
        </label>
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
        {isSubmitting ? 'Submitting…' : 'Share your story'}
      </Button>

      {status && !status.success && <FormError message={status.message} />}
    </form>
  )
}
