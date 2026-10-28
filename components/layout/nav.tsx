'use client'

import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import Image from 'next/image'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/brand/Logo'
import { ButtonLink } from '@/components/ui/button'
import { SmartLink } from '@/components/ui/smart-link'
import { NewsletterModalTrigger } from './newsletter-modal'
import { resolveHref, type ResolvedLink } from '@/lib/link'
import { cn } from '@/lib/utils'
import { MobileMenu } from './mobile-menu'
import { SearchTrigger } from './search-trigger'

export type NavItemData = { title: string; description?: string; icon?: string; link: ResolvedLink }
export type NavFeaturedData = {
  eyebrow?: string
  title: string
  description?: string
  image?: { url: string; alt?: string } | null
  link: ResolvedLink
}
export type NavGroupData = {
  label: string
  link?: ResolvedLink
  featured?: NavFeaturedData | null
  items?: NavItemData[]
}
export type NavData = {
  mainNav?: NavGroupData[]
  secondaryLink?: ResolvedLink
  primaryCta?: { style?: string; action?: string; link?: ResolvedLink }
} | null

/** Photo card at the left of a dropdown. The whole card is the link. */
function FeaturedCard({ featured }: { featured: NavFeaturedData }) {
  return (
    <SmartLink
      link={featured.link}
      className="group/card nav-rise rounded-input relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden p-6 text-white md:col-span-5"
    >
      {featured.image && (
        <Image
          src={featured.image.url}
          alt=""
          fill
          sizes="400px"
          className="-z-20 object-cover transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.06]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to top, color-mix(in srgb, var(--plum-950) 94%, transparent) 0%, color-mix(in srgb, var(--plum-950) 62%, transparent) 50%, transparent 100%)',
        }}
      />
      {featured.eyebrow && (
        <span className="mb-2 text-[11px] font-medium tracking-[0.18em] uppercase opacity-85">
          {featured.eyebrow}
        </span>
      )}
      <span className="font-display text-2xl leading-tight font-semibold">{featured.title}</span>
      {featured.description && (
        <span className="mt-1.5 max-w-[26ch] text-sm leading-snug opacity-90">
          {featured.description}
        </span>
      )}
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
        {featured.link?.label}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover/card:translate-x-1"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </SmartLink>
  )
}

export function Nav({ data }: { data: NavData }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'border-default bg-canvas/95 sticky top-0 z-50 w-full border-b backdrop-blur-md transition-shadow',
        scrolled && 'shadow-sm',
      )}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div
        className={cn(
          'relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 transition-[padding] duration-300 sm:px-6',
          scrolled && 'py-2',
        )}
      >
        <NextLink href="/" className="px-2" aria-label="Cysters In Action, home">
          <Logo className={cn('transition-all duration-300', scrolled ? 'h-9' : 'h-11')} />
        </NextLink>

        <NavigationMenu.Root className="hidden md:block" delayDuration={80} skipDelayDuration={300}>
          <NavigationMenu.List className="flex items-center gap-1">
            {(data?.mainNav ?? []).map((group) => (
              <NavigationMenu.Item key={group.label}>
                <NavigationMenu.Trigger className="group text-fg hover:bg-muted data-[state=open]:bg-muted rounded-pill flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors">
                  {group.label}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-data-[state=open]:rotate-180"
                  >
                    <path
                      d="M2 4.25L6 8l4-3.75"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </NavigationMenu.Trigger>
                {group.items && group.items.length > 0 && (
                  <NavigationMenu.Content className="nav-panel">
                    <div className="border-default bg-canvas rounded-card grid gap-3 border p-3 shadow-[0_32px_70px_-24px_rgb(19_77_100/0.45)] md:grid-cols-12">
                      {group.featured && <FeaturedCard featured={group.featured} />}
                      <ul
                        className={cn(
                          'flex flex-col justify-center p-2',
                          group.featured ? 'md:col-span-7' : 'md:col-span-12',
                        )}
                      >
                        {group.items.map((item, i) => (
                          <li
                            key={item.title}
                            className="nav-rise"
                            style={{ '--i': i } as React.CSSProperties}
                          >
                            <SmartLink
                              link={item.link}
                              className="group/item hover:bg-muted focus-visible:bg-muted rounded-input flex items-center justify-between gap-6 px-4 py-3.5 transition-colors"
                            >
                              <span>
                                <span className="text-fg-heading font-display block text-base font-semibold">
                                  {item.title}
                                </span>
                                {item.description && (
                                  <span className="text-fg-muted mt-0.5 block text-sm">
                                    {item.description}
                                  </span>
                                )}
                              </span>
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                                className="text-fg-heading shrink-0 -translate-x-2 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100"
                              >
                                <path
                                  d="M5 12h14M13 6l6 6-6 6"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </SmartLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenu.Content>
                )}
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
          {/* Anchored to the header row (the nearest positioned ancestor), not
              the link list, so the panel spans the full header width. Padding,
              not margin, so there's no dead gap that would close the menu. */}
          <div className="absolute top-full right-0 left-0 pt-3">
            <NavigationMenu.Viewport />
          </div>
        </NavigationMenu.Root>

        <div className="hidden items-center gap-4 md:flex">
          <SearchTrigger />
          {data?.secondaryLink && (
            <SmartLink
              link={data.secondaryLink}
              className="text-fg-link hover:text-fg-link-hover text-sm font-medium"
            >
              {data.secondaryLink.label}
            </SmartLink>
          )}
          {data?.primaryCta?.link &&
            (data.primaryCta.action === 'openNewsletter' ? (
              <NewsletterModalTrigger label={data.primaryCta.link.label} size="sm" />
            ) : (
              <ButtonLink href={resolveHref(data.primaryCta.link)} variant="solid" size="sm">
                {data.primaryCta.link.label}
              </ButtonLink>
            ))}
        </div>

        <div className="flex items-center md:hidden">
          <SearchTrigger />
          <MobileMenu data={data} />
        </div>
      </div>
    </header>
  )
}
