import { z } from 'zod'

// Shared client/server (Section 7: "Shared Zod schemas client and server").
// `honeypot` must stay empty — a filled value means a bot filled every field.

export const newsletterSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  firstName: z.string().max(100).optional(),
  source: z.enum(['nav', 'footer', 'newsletterBlock', 'article', 'newsletterPage']),
  honeypot: z.string().max(0, 'Spam check failed').optional().default(''),
  turnstileToken: z.string().optional().default(''),
})

export type NewsletterInput = z.infer<typeof newsletterSchema>

export const contactSchema = z.object({
  enquiryType: z.string().min(1, 'Choose an enquiry type'),
  name: z.string().min(1, 'Enter your name').max(200),
  email: z.string().email('Enter a valid email address'),
  organisation: z.string().max(200).optional(),
  message: z.string().min(10, 'Tell us a little more — at least 10 characters').max(5000),
  honeypot: z.string().max(0, 'Spam check failed').optional().default(''),
  turnstileToken: z.string().optional().default(''),
})

export type ContactInput = z.infer<typeof contactSchema>

const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']

export const shareStorySchema = z.object({
  isAnonymous: z.boolean().default(false),
  authorName: z.string().max(100).optional(),
  email: z.string().email('Enter a valid email address'),
  title: z.string().min(1, 'Give your story a title').max(90),
  body: z
    .string()
    .min(200, 'Your story needs at least 200 characters — take your time')
    .max(5000, 'Your story is longer than 5,000 characters'),
  themes: z
    .array(
      z.enum(['diagnosis', 'fertility', 'mental health', 'nutrition', 'work', 'relationships']),
    )
    .default([]),
  ageRange: z.string().optional(),
  country: z.string().max(100).optional(),
  contentWarning: z.string().max(200).optional(),
  photo: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_PHOTO_BYTES, 'Photo must be 5MB or smaller')
    .refine((f) => ACCEPTED_PHOTO_TYPES.includes(f.type), 'Photo must be JPG, PNG or HEIC')
    .optional(),
  consentPublish: z.boolean().refine((v) => v === true, 'You must consent to publish your story'),
  consentEdit: z.boolean().default(false),
  consentContact: z.boolean().default(false),
  honeypot: z.string().max(0, 'Spam check failed').optional().default(''),
  turnstileToken: z.string().optional().default(''),
})

export type ShareStoryInput = z.infer<typeof shareStorySchema>

export const rsvpSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(1, 'Enter your name').max(200),
  email: z.string().email('Enter a valid email address'),
  attendance: z.enum(['attending', 'maybe']),
  questions: z.string().max(1000).optional(),
  consentNewsletter: z.boolean().default(false),
  honeypot: z.string().max(0, 'Spam check failed').optional().default(''),
  turnstileToken: z.string().optional().default(''),
})

export type RsvpInput = z.infer<typeof rsvpSchema>
