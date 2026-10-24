import { NewsletterForm } from '@/components/forms/newsletter-form'
import { SmartLink } from '@/components/ui/smart-link'
import type { ResolvedLink } from '@/lib/link'

export type FooterColumn = { heading: string; links?: ResolvedLink[] }
export type FooterData = {
  blurb?: string
  columns?: FooterColumn[]
  showNewsletter?: boolean
  newsletterHeading?: string
  legalLinks?: ResolvedLink[]
  copyrightText?: string
  credit?: ResolvedLink
} | null

export type SiteSettingsData = {
  siteName?: string
  contactEmail?: string
  phone?: string
  address?: {
    organisationName?: string
    line1?: string
    line2?: string
    city?: string
    country?: string
  } | null
  medicalDisclaimer?: unknown
} | null

export function Footer({
  data,
  siteSettings,
}: {
  data: FooterData
  siteSettings: SiteSettingsData
}) {
  const year = new Date().getFullYear()
  const copyright = (
    data?.copyrightText ?? '© {year} Cysters In Action. All rights reserved.'
  ).replace('{year}', String(year))

  return (
    <footer className="bg-canvas text-fg border-default mt-24 border-t px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-7">
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-fg-heading text-lg font-semibold">{siteSettings?.siteName}</p>
            {data?.blurb && <p className="text-fg-muted mt-2 max-w-sm text-sm">{data.blurb}</p>}
            <div className="text-fg-muted mt-4 space-y-1 text-sm">
              {siteSettings?.address?.line1 && <p>{siteSettings.address.line1}</p>}
              {siteSettings?.address?.city && (
                <p>
                  {siteSettings.address.city}
                  {siteSettings.address.country ? `, ${siteSettings.address.country}` : ''}
                </p>
              )}
              {siteSettings?.contactEmail && <p>{siteSettings.contactEmail}</p>}
              {siteSettings?.phone && <p>{siteSettings.phone}</p>}
            </div>
          </div>

          {(data?.columns ?? []).map((column) => (
            <div key={column.heading}>
              <p className="text-fg-heading text-sm font-semibold">{column.heading}</p>
              <ul className="mt-3 space-y-2">
                {(column.links ?? []).map((link, i) => (
                  <li key={i}>
                    <SmartLink link={link} className="text-fg-muted hover:text-fg text-sm">
                      {link?.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {data?.showNewsletter && (
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-fg-heading text-sm font-semibold">
                {data.newsletterHeading ?? 'Newsletter'}
              </p>
              <div className="mt-3">
                <NewsletterForm source="footer" />
              </div>
            </div>
          )}
        </div>

        {siteSettings?.medicalDisclaimer ? (
          <p className="text-fg-muted mt-10 max-w-3xl text-xs">
            This site provides health information, not medical advice.
          </p>
        ) : null}

        <div className="border-default text-fg-muted mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs md:flex-row">
          <p>{copyright}</p>
          <div className="flex gap-4">
            {(data?.legalLinks ?? []).map((link, i) => (
              <SmartLink key={i} link={link} className="hover:text-fg">
                {link?.label}
              </SmartLink>
            ))}
          </div>
          {data?.credit && (
            <SmartLink link={data.credit} className="hover:text-fg">
              {data.credit.label}
            </SmartLink>
          )}
        </div>
      </div>
    </footer>
  )
}
