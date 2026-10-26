'use client'

import * as Accordion from '@radix-ui/react-accordion'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { SmartLink } from '@/components/ui/smart-link'
import { resolveHref } from '@/lib/link'
import { NewsletterModalTrigger } from './newsletter-modal'
import type { NavData } from './nav'

export function MobileMenu({ data }: { data: NavData }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="rounded-pill text-fg p-2 md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-menu-overlay fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="mobile-menu-panel bg-canvas border-default fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l p-6 shadow-2xl">
          <div className="flex justify-end">
            <Dialog.Close aria-label="Close menu" className="rounded-pill text-fg p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Dialog.Close>
          </div>

          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <Accordion.Root type="single" collapsible className="mt-4 flex-1 overflow-y-auto">
            {(data?.mainNav ?? []).map((group) => (
              <Accordion.Item
                key={group.label}
                value={group.label}
                className="border-default border-b"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group text-fg-heading flex w-full items-center justify-between py-4 text-left text-lg font-medium">
                    {group.label}
                    <svg
                      width="12"
                      height="12"
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
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="accordion-content overflow-hidden pb-4">
                  <ul className="flex flex-col gap-3">
                    {(group.items ?? []).map((item) => (
                      <li key={item.title}>
                        <SmartLink link={item.link} className="block">
                          <span className="text-fg block text-base font-medium">{item.title}</span>
                          {item.description && (
                            <span className="text-fg-muted block text-sm">{item.description}</span>
                          )}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <div className="border-default mt-auto flex flex-col gap-3 border-t pt-4">
            {data?.secondaryLink && (
              <SmartLink
                link={data.secondaryLink}
                className="text-fg-link text-center text-sm font-medium"
              >
                {data.secondaryLink.label}
              </SmartLink>
            )}
            {data?.primaryCta?.link &&
              (data.primaryCta.action === 'openNewsletter' ? (
                <NewsletterModalTrigger label={data.primaryCta.link.label} className="w-full" />
              ) : (
                <ButtonLink
                  href={resolveHref(data.primaryCta.link)}
                  variant="solid"
                  className="w-full"
                >
                  {data.primaryCta.link.label}
                </ButtonLink>
              ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
