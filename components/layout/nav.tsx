'use client'

import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { SmartLink } from '@/components/ui/smart-link'
import { resolveHref, type ResolvedLink } from '@/lib/link'
import { cn } from '@/lib/utils'
import { MobileMenu } from './mobile-menu'

export type NavItemData = { title: string; description?: string; icon?: string; link: ResolvedLink }
export type NavGroupData = { label: string; link?: ResolvedLink; items?: NavItemData[] }
export type NavData = {
  mainNav?: NavGroupData[]
  secondaryLink?: ResolvedLink
  primaryCta?: { style?: string; link?: ResolvedLink }
} | null

export function Nav({ data, siteName }: { data: NavData; siteName: string }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-5xl px-4">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div
        className={cn(
          'border-default bg-canvas/90 flex items-center justify-between rounded-[var(--radius-pill)] border px-4 py-2 backdrop-blur-md transition-all',
          scrolled && 'py-1.5 shadow-md',
        )}
      >
        <NextLink href="/" className="text-fg-heading px-2 text-sm font-semibold">
          {siteName}
        </NextLink>

        <NavigationMenu.Root className="relative hidden md:block" delayDuration={100}>
          <NavigationMenu.List className="flex items-center gap-1">
            {(data?.mainNav ?? []).map((group) => (
              <NavigationMenu.Item key={group.label}>
                <NavigationMenu.Trigger className="text-fg hover:bg-muted data-[state=open]:bg-muted rounded-[var(--radius-pill)] px-3 py-2 text-sm font-medium">
                  {group.label}
                </NavigationMenu.Trigger>
                {group.items && group.items.length > 0 && (
                  <NavigationMenu.Content className="rounded-card border-default bg-canvas absolute top-full left-0 mt-2 w-80 border p-3 shadow-lg">
                    <ul className="flex flex-col gap-1">
                      {group.items.map((item) => (
                        <li key={item.title}>
                          <SmartLink
                            link={item.link}
                            className="hover:bg-muted block rounded-lg px-3 py-2"
                          >
                            <span className="text-fg block text-sm font-medium">{item.title}</span>
                            {item.description && (
                              <span className="text-fg-muted block text-xs">
                                {item.description}
                              </span>
                            )}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenu.Content>
                )}
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
          <NavigationMenu.Viewport />
        </NavigationMenu.Root>

        <div className="hidden items-center gap-4 md:flex">
          {data?.secondaryLink && (
            <SmartLink
              link={data.secondaryLink}
              className="text-fg-link hover:text-fg-link-hover text-sm font-medium"
            >
              {data.secondaryLink.label}
            </SmartLink>
          )}
          {data?.primaryCta?.link && (
            <ButtonLink
              href={resolveHref(data.primaryCta.link)}
              variant="solid"
              className="text-sm"
            >
              {data.primaryCta.link.label}
            </ButtonLink>
          )}
        </div>

        <MobileMenu data={data} />
      </div>
    </header>
  )
}
