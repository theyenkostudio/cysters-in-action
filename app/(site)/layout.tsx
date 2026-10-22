import { AnnouncementBar, type AnnouncementBarData } from '@/components/layout/announcement-bar'
import { Footer, type FooterData, type SiteSettingsData } from '@/components/layout/footer'
import { Nav, type NavData } from '@/components/layout/nav'
import { LenisProvider } from '@/components/motion/lenis-provider'
import { sanityFetch } from '@/lib/sanity/fetch'
import {
  announcementBarQuery,
  footerQuery,
  navigationQuery,
  siteSettingsQuery,
} from '@/lib/sanity/queries'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, navigation, footer, announcementBar] = await Promise.all([
    sanityFetch<SiteSettingsData>({ query: siteSettingsQuery, tags: ['siteSettings'] }),
    sanityFetch<NavData>({ query: navigationQuery, tags: ['navigation'] }),
    sanityFetch<FooterData>({ query: footerQuery, tags: ['footer'] }),
    sanityFetch<AnnouncementBarData>({ query: announcementBarQuery, tags: ['announcementBar'] }),
  ])

  const siteName = siteSettings?.siteName ?? 'Cysters In Action'

  return (
    <LenisProvider>
      <AnnouncementBar data={announcementBar} />
      <Nav data={navigation} siteName={siteName} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer data={footer} siteSettings={siteSettings} />
    </LenisProvider>
  )
}
