import 'server-only'

export type SubscribeInput = {
  email: string
  firstName?: string
  tags: string[]
  source: string
}

export interface EmailProvider {
  subscribe(input: SubscribeInput): Promise<void>
  unsubscribe(email: string): Promise<void>
  addTag(email: string, tag: string): Promise<void>
}

/** Logs only — the default when EMAIL_PROVIDER is unset. Safe for local dev. */
class NullProvider implements EmailProvider {
  async subscribe(input: SubscribeInput) {
    console.log('[email-provider:null] subscribe', input)
  }
  async unsubscribe(email: string) {
    console.log('[email-provider:null] unsubscribe', email)
  }
  async addTag(email: string, tag: string) {
    console.log('[email-provider:null] addTag', email, tag)
  }
}

/** Brevo (recommended — Section 7). Double opt-in via Brevo's own contact flow. */
class BrevoProvider implements EmailProvider {
  constructor(
    private apiKey: string,
    private listId: string,
  ) {}

  private async request(path: string, init: RequestInit) {
    const res = await fetch(`https://api.brevo.com/v3${path}`, {
      ...init,
      headers: { 'api-key': this.apiKey, 'content-type': 'application/json', ...init.headers },
    })
    if (!res.ok) throw new Error(`Brevo API error ${res.status}: ${await res.text()}`)
    return res
  }

  async subscribe({ email, firstName, tags, source }: SubscribeInput) {
    await this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName, SOURCE: source },
        listIds: [Number(this.listId)],
        tags,
        updateEnabled: true,
      }),
    })
  }

  async unsubscribe(email: string) {
    await this.request(`/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      body: JSON.stringify({ unlinkListIds: [Number(this.listId)] }),
    })
  }

  async addTag(email: string, tag: string) {
    await this.request(`/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      body: JSON.stringify({ tags: [tag] }),
    })
  }
}

/** Mailchimp (supported — Section 7). */
class MailchimpProvider implements EmailProvider {
  constructor(
    private apiKey: string,
    private serverPrefix: string,
    private listId: string,
  ) {}

  private async request(path: string, init: RequestInit) {
    const res = await fetch(`https://${this.serverPrefix}.api.mailchimp.com/3.0${path}`, {
      ...init,
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${this.apiKey}`).toString('base64')}`,
        'content-type': 'application/json',
        ...init.headers,
      },
    })
    if (!res.ok) throw new Error(`Mailchimp API error ${res.status}: ${await res.text()}`)
    return res
  }

  async subscribe({ email, firstName, tags, source }: SubscribeInput) {
    await this.request(`/lists/${this.listId}/members`, {
      method: 'POST',
      body: JSON.stringify({
        email_address: email,
        status: 'pending', // double opt-in
        merge_fields: { FNAME: firstName ?? '', SOURCE: source },
        tags,
      }),
    })
  }

  async unsubscribe(email: string) {
    const subscriberHash = await this.hashEmail(email)
    await this.request(`/lists/${this.listId}/members/${subscriberHash}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'unsubscribed' }),
    })
  }

  async addTag(email: string, tag: string) {
    const subscriberHash = await this.hashEmail(email)
    await this.request(`/lists/${this.listId}/members/${subscriberHash}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tags: [{ name: tag, status: 'active' }] }),
    })
  }

  private async hashEmail(email: string) {
    const { createHash } = await import('node:crypto')
    return createHash('md5').update(email.toLowerCase()).digest('hex')
  }
}

let cachedProvider: EmailProvider | undefined

/** Selected by `EMAIL_PROVIDER` env var — switching providers is a config change, not a code change. */
export function getEmailProvider(): EmailProvider {
  if (cachedProvider) return cachedProvider

  const provider = process.env.EMAIL_PROVIDER ?? 'null'

  switch (provider) {
    case 'brevo': {
      const apiKey = process.env.BREVO_API_KEY
      const listId = process.env.BREVO_LIST_ID
      if (!apiKey || !listId) {
        console.warn(
          '[email-provider] EMAIL_PROVIDER=brevo but BREVO_API_KEY/BREVO_LIST_ID are unset — falling back to NullProvider.',
        )
        cachedProvider = new NullProvider()
      } else {
        cachedProvider = new BrevoProvider(apiKey, listId)
      }
      break
    }
    case 'mailchimp': {
      const apiKey = process.env.MAILCHIMP_API_KEY
      const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX
      const listId = process.env.MAILCHIMP_LIST_ID
      if (!apiKey || !serverPrefix || !listId) {
        console.warn(
          '[email-provider] EMAIL_PROVIDER=mailchimp but required env vars are unset — falling back to NullProvider.',
        )
        cachedProvider = new NullProvider()
      } else {
        cachedProvider = new MailchimpProvider(apiKey, serverPrefix, listId)
      }
      break
    }
    default:
      cachedProvider = new NullProvider()
  }

  return cachedProvider
}
