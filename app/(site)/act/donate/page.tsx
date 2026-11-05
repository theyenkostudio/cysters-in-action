import type { Metadata } from 'next'
import { Hero } from '@/components/blocks/hero'
import { CopyButton } from '@/components/connect/copy-button'
import { Reveal, Stagger } from '@/components/motion/reveal'
import { ButtonLink } from '@/components/ui/button'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { donatePage as data } from '@/lib/sanity/fixtures/donatePage'

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Ways to give to Cysters in Action: mobile money and bank transfer.',
}

export default function DonatePage() {
  return (
    <>
      <Hero data={data.hero} animation="subtle" />
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-20 sm:pb-32">
        <div>
          <SectionEyebrow>Ways to give</SectionEyebrow>
          <Stagger className="mt-6 grid gap-5 md:grid-cols-3">
            {data.methods.map((m) => {
              return (
                <Reveal key={m.id} className="h-full">
                  <article className="rounded-card border-default bg-canvas flex h-full flex-col border p-7">
                    <p className="text-fg-subtle text-xs font-semibold tracking-[0.16em] uppercase">
                      {m.kind}
                    </p>
                    <h2 className="font-display text-fg-heading mt-2 text-2xl font-semibold">
                      {m.name}
                    </h2>
                    <p className="text-fg-muted mt-2 text-sm leading-relaxed">{m.description}</p>

                    <dl className="mt-6 divide-y divide-[var(--color-border-default)]">
                      {m.details.map((d) => (
                        <div key={d.label} className="flex items-center justify-between gap-3 py-3">
                          <div className="min-w-0">
                            <dt className="text-fg-subtle text-xs">{d.label}</dt>
                            <dd className="text-fg-heading mt-0.5 text-base font-medium tabular-nums">
                              {d.value}
                            </dd>
                          </div>
                          {d.copy && (
                            <CopyButton
                              value={d.copy}
                              label={`${m.name} ${d.label.toLowerCase()}`}
                            />
                          )}
                        </div>
                      ))}
                    </dl>

                    <p className="bg-muted text-fg-muted rounded-input mt-auto p-3 text-sm">
                      <span className="text-fg-heading font-medium">Reference: </span>
                      {data.reference.code}. {m.note}
                    </p>
                  </article>
                </Reveal>
              )
            })}
          </Stagger>
        </div>

        <div className="mt-20">
          <SectionEyebrow>How it works</SectionEyebrow>
          <ol className="mt-6 grid gap-10 md:grid-cols-3">
            {data.steps.map((s, i) => (
              <li key={s.title}>
                <span className="font-display text-fg-heading text-5xl font-semibold tracking-[-0.04em] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="bg-fg/20 mt-4 h-px" aria-hidden="true" />
                <h3 className="font-display text-fg-heading mt-4 text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="text-fg-muted mt-1.5 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="rounded-card bg-muted mt-20 flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-xl">
            <p className="font-display text-fg-heading text-2xl font-semibold">{data.thanks}</p>
            <p className="text-fg-muted mt-2 leading-relaxed">{data.transparency}</p>
          </div>
          <ButtonLink href="/contact" variant="solid">
            Get in touch
          </ButtonLink>
        </Reveal>
      </div>
    </>
  )
}
