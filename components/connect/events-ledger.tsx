'use client'

import { useRef, useState } from 'react'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import { ButtonLink } from '@/components/ui/button'
import type { EventRef, EventType } from '@/lib/sanity/types'
import { PILLAR_SOLID_VAR } from '@/components/blocks/WaysWeShowUp/pillar-colors'
import { useGsapScope } from '@/components/motion/use-gsap-scope'
import { EventRsvpDialog } from './event-rsvp-dialog'

const TYPE_LABEL: Record<EventType, string> = {
  webinar: 'Webinar',
  meetup: 'Meetup',
  qna: 'Q&A',
  workshop: 'Workshop',
  other: 'Event',
}
const TYPE_PILLAR: Record<EventType, keyof typeof PILLAR_SOLID_VAR> = {
  webinar: 'learn',
  qna: 'learn',
  meetup: 'connect',
  workshop: 'act',
  other: 'learn',
}
const FORMAT_LABEL = { online: 'Online', inPerson: 'In person', hybrid: 'Online + in person' }

function parts(event: EventRef) {
  const d = new Date(event.startDateTime)
  const f = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { ...o, timeZone: event.timezone }).format(d)
  return {
    day: f({ day: 'numeric' }),
    month: f({ month: 'short' }),
    weekday: f({ weekday: 'long' }),
    time: f({ hour: '2-digit', minute: '2-digit', hour12: false }),
  }
}

/**
 * Events as an agenda, not cards: a ruled list with the date as the visual
 * anchor. Rules draw in, dates and titles rise on a stagger, and each row
 * The only hover state is the arrow disc, which fills with the event's colour and turns.
 */
export function EventsLedger({
  events,
  heading = 'Upcoming events',
  cta,
  rsvpCounts = {},
}: {
  events: EventRef[]
  rsvpCounts?: Record<string, number>
  heading?: string
  cta?: { label: string; href: string }
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [activeEvent, setActiveEvent] = useState<EventRef | null>(null)

  useGsapScope(
    ref,
    ({ gsap, ScrollTrigger }) => {
      const q = gsap.utils.selector(ref.current!)
      const rules = q('[data-rule]')
      const rises = q('[data-rise]')
      gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(rises, { yPercent: 110, opacity: 0 })
      ScrollTrigger.create({
        trigger: q('[data-list]')[0],
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(rules, { scaleX: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out' })
          gsap.to(rises, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.04,
            delay: 0.15,
            ease: 'expo.out',
          })
        },
      })
    },
    !reduced,
    [events.length],
  )

  return (
    <section ref={ref} className="bg-canvas px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-fg-muted text-xs font-medium tracking-[0.2em] uppercase">
              What&rsquo;s on
            </p>
            <h2 className="font-display text-fg-heading mt-3 text-[clamp(40px,6vw,84px)] leading-[0.98] font-semibold tracking-[-0.03em]">
              {heading}
            </h2>
          </div>
          {cta && (
            <div className="flex items-center gap-5">
              <span className="text-fg-muted hidden text-sm sm:block">
                {events.length} coming up
              </span>
              <ButtonLink href={cta.href} variant="outline" size="sm">
                {cta.label}
              </ButtonLink>
            </div>
          )}
        </div>

        <ul data-list className="mt-12 sm:mt-16">
          {events.map((event) => {
            const t = parts(event)
            const color = PILLAR_SOLID_VAR[TYPE_PILLAR[event.eventType]]
            return (
              <li key={event._id} className="relative">
                <span
                  data-rule
                  aria-hidden="true"
                  className="bg-fg/25 absolute inset-x-0 top-0 h-px"
                />
                <button
                  type="button"
                  onClick={() => setActiveEvent(event)}
                  className="group relative grid w-full cursor-pointer grid-cols-[104px_1fr] items-center gap-x-6 gap-y-3 overflow-hidden py-7 text-left sm:gap-x-10 sm:py-9 md:grid-cols-[170px_1fr_minmax(0,300px)_auto] md:gap-x-12"
                  style={{ '--c': color } as React.CSSProperties}
                >
                  <div className="relative overflow-hidden">
                    <div data-rise className="flex items-baseline gap-3">
                      <span className="font-display text-fg-heading text-[clamp(56px,7vw,104px)] leading-[0.85] font-semibold tracking-[-0.04em] tabular-nums">
                        {t.day}
                      </span>
                      <span className="text-fg-muted text-xs leading-tight font-medium tracking-[0.16em] uppercase">
                        {t.month}
                        <br className="hidden sm:block" />
                        <span className="hidden opacity-70 sm:inline">{t.weekday.slice(0, 3)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative min-w-0">
                    <div className="overflow-hidden">
                      <h3
                        data-rise
                        className="font-display text-fg-heading text-[clamp(22px,2.6vw,36px)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance"
                      >
                        {event.title}
                      </h3>
                    </div>
                    <div className="overflow-hidden">
                      <p
                        data-rise
                        className="text-fg-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
                      >
                        <span className="inline-flex items-center gap-2 font-medium text-[var(--c)]">
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full"
                            style={{ background: 'var(--c)' }}
                          />
                          {TYPE_LABEL[event.eventType]}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{t.time}</span>
                        <span aria-hidden="true">·</span>
                        <span>{FORMAT_LABEL[event.format]}</span>
                      </p>
                    </div>
                  </div>

                  {event.summary && (
                    <p className="text-fg-muted relative col-span-2 hidden text-[15px] leading-snug md:col-span-1 md:block">
                      {event.summary}
                    </p>
                  )}

                  <span
                    aria-hidden="true"
                    className="relative hidden h-14 w-14 [transform:rotate(-45deg)] items-center justify-center rounded-full border border-current text-[var(--c)] transition-all duration-500 group-hover:[transform:rotate(0deg)] group-hover:bg-[var(--c)] group-hover:text-white group-focus-visible:[transform:rotate(0deg)] group-focus-visible:bg-[var(--c)] group-focus-visible:text-white md:flex"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </li>
            )
          })}
          <li className="relative h-px">
            <span data-rule aria-hidden="true" className="bg-fg/25 absolute inset-0" />
          </li>
        </ul>
      </div>

      <EventRsvpDialog
        event={activeEvent}
        rsvpCount={activeEvent ? rsvpCounts[activeEvent._id] : undefined}
        onOpenChange={(open) => !open && setActiveEvent(null)}
      />
    </section>
  )
}
