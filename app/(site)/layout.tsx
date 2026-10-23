import { AnnouncementBar } from '@/components/layout/announcement-bar'
import { Footer } from '@/components/layout/footer'
import { Nav } from '@/components/layout/nav'
import { LenisProvider } from '@/components/motion/lenis-provider'
import { getAnnouncementBar, getFooter, getNavigation, getSiteSettings } from '@/lib/sanity/content'
import { JsonLd, organizationJsonLd } from '@/lib/seo'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, navigation, footer, announcementBar] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getFooter(),
    getAnnouncementBar(),
  ])

  return (
    <LenisProvider>
      <JsonLd data={organizationJsonLd(siteSettings?.siteName ?? 'Cysters In Action')} />
      <AnnouncementBar data={announcementBar} />
      <Nav data={navigation} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer data={footer} siteSettings={siteSettings} />
    </LenisProvider>
  )
}
