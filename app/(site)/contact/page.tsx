import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/contact-form'
import { Hero } from '@/components/blocks/hero'
import { Reveal } from '@/components/motion/reveal'
import { getContactPage, getSiteSettings } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await getContactPage()
  return seoToMetadata(contactPage?.seo, { title: 'Contact' }, '/contact')
}

export default async function ContactPage() {
  const [contactPage, siteSettings] = await Promise.all([getContactPage(), getSiteSettings()])
  if (!contactPage) return null

  return (
    <>
      <Hero data={contactPage.hero} animation="subtle" />

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1fr_1.2fr]">
        <Reveal>
          {contactPage.intro && <p className="text-fg-muted">{contactPage.intro}</p>}
          <div className="text-fg-muted mt-6 space-y-1 text-sm">
            {siteSettings?.contactEmail && <p>{siteSettings.contactEmail}</p>}
            {siteSettings?.phone && <p>{siteSettings.phone}</p>}
            {siteSettings?.address?.line1 && <p>{siteSettings.address.line1}</p>}
            {siteSettings?.address?.city && (
              <p>
                {siteSettings.address.city}
                {siteSettings.address.country ? `, ${siteSettings.address.country}` : ''}
              </p>
            )}
          </div>
          {contactPage.showMap && contactPage.mapEmbedUrl && (
            <div className="rounded-card mt-6 aspect-video overflow-hidden">
              <iframe
                src={contactPage.mapEmbedUrl}
                className="h-full w-full"
                loading="lazy"
                title="Map"
              />
            </div>
          )}
        </Reveal>

        <Reveal>
          <ContactForm
            enquiryTypes={contactPage.enquiryTypes}
            successMessage={contactPage.successMessage}
          />
        </Reveal>
      </div>
    </>
  )
}
