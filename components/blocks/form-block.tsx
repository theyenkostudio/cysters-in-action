import { ContactForm } from '@/components/forms/contact-form'
import { NewsletterForm } from '@/components/forms/newsletter-form'
import { Reveal } from '@/components/motion/reveal'
import { getContactPage } from '@/lib/sanity/content'

export type FormBlockData = {
  formType: 'contact' | 'volunteer' | 'partner' | 'newsletter'
  heading?: string
  intro?: string
}

export async function FormBlock({ data }: { data: FormBlockData }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-8">
      <Reveal>
        {data.heading && (
          <h2 className="font-display text-fg-heading text-2xl font-semibold sm:text-3xl">
            {data.heading}
          </h2>
        )}
        {data.intro && <p className="text-fg-muted mt-3">{data.intro}</p>}
        <div className="mt-6">
          <FormBody data={data} />
        </div>
      </Reveal>
    </section>
  )
}

async function FormBody({ data }: { data: FormBlockData }) {
  switch (data.formType) {
    case 'contact': {
      const contactPage = await getContactPage()
      return (
        <ContactForm
          enquiryTypes={contactPage?.enquiryTypes ?? []}
          successMessage={contactPage?.successMessage}
        />
      )
    }
    case 'newsletter':
      return <NewsletterForm source="newsletterBlock" />
    case 'volunteer':
    case 'partner':
      return <p className="text-fg-muted">This form ships in Phase 6.</p>
  }
}
