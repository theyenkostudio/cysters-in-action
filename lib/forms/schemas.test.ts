import { describe, expect, it } from 'vitest'
import { contactSchema, newsletterSchema } from './schemas'

describe('newsletterSchema', () => {
  it('accepts a valid submission', () => {
    const result = newsletterSchema.safeParse({ email: 'a@example.com', source: 'footer' })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = newsletterSchema.safeParse({ email: 'not-an-email', source: 'footer' })
    expect(result.success).toBe(false)
  })

  it('rejects a filled honeypot (bot submission)', () => {
    const result = newsletterSchema.safeParse({
      email: 'a@example.com',
      source: 'footer',
      honeypot: 'bot',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown source', () => {
    const result = newsletterSchema.safeParse({ email: 'a@example.com', source: 'somewhere-else' })
    expect(result.success).toBe(false)
  })
})

describe('contactSchema', () => {
  const valid = {
    enquiryType: 'general',
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'This is a message that is definitely long enough.',
  }

  it('accepts a valid submission', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a too-short message', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'short' })
    expect(result.success).toBe(false)
  })

  it('rejects a filled honeypot', () => {
    const result = contactSchema.safeParse({ ...valid, honeypot: 'bot' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing name', () => {
    const result = contactSchema.safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
  })
})
