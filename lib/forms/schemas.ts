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
