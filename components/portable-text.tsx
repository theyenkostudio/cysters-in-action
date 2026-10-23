import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { ButtonLink } from '@/components/ui/button'
import { GlossaryTooltip } from '@/components/glossary/glossary-tooltip'
import { resolveHref } from '@/lib/link'
import type { RichTextValue } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'
import { slugify } from '@/lib/slugify'

const TONE_CLASSES: Record<string, string> = {
  info: 'bg-info-bg text-info-text',
  warning: 'bg-warning-bg text-warning-text',
  tip: 'bg-success-bg text-success-text',
}

function headingId(value: { children?: unknown[] }) {
  const text = (value.children ?? [])
    .map((c) =>
      typeof c === 'object' && c && 'text' in c ? String((c as { text?: unknown }).text ?? '') : '',
    )
    .join('')
  return slugify(text)
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2
        id={headingId(value)}
        className="text-fg-heading font-display mt-10 text-2xl font-semibold"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={headingId(value)} className="text-fg-heading font-display mt-8 text-xl font-semibold">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-fg-heading font-display mt-6 text-lg font-semibold">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-accent-lagoon text-fg-muted my-6 border-l-4 pl-4 text-lg italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="text-fg mt-4 leading-relaxed">{children}</p>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = resolveHref(value?.link)
      return (
        <NextLink
          href={href}
          className="text-fg-link hover:text-fg-link-hover underline underline-offset-2"
        >
          {children}
        </NextLink>
      )
    },
    glossaryTerm: ({ value, children }) => {
      const term = value?.term
      if (!term?.slug?.current) return <>{children}</>
      return (
        <GlossaryTooltip
          term={term.term}
          shortDefinition={term.shortDefinition}
          slug={term.slug.current}
        >
          {children}
        </GlossaryTooltip>
      )
    },
  },
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <div className="rounded-card relative aspect-video overflow-hidden">
          <Image
            src={value.url}
            alt={value.alt ?? ''}
            fill
            sizes="(min-width: 768px) 700px, 100vw"
            className="object-cover"
          />
        </div>
        {value.caption && (
          <figcaption className="text-fg-subtle mt-2 text-sm">{value.caption}</figcaption>
        )}
      </figure>
    ),
    callout: ({ value }) => (
      <aside
        className={cn(
          'rounded-card my-6 p-4 text-sm',
          TONE_CLASSES[value.tone] ?? TONE_CLASSES.info,
        )}
      >
        {value.text}
      </aside>
    ),
    mythFact: ({ value }) => (
      <div className="rounded-card border-default my-6 grid gap-3 border p-5 sm:grid-cols-2">
        <div>
          <p className="text-error-text text-xs font-semibold tracking-wide uppercase">Myth</p>
          <p className="text-fg mt-1">{value.myth}</p>
        </div>
        <div>
          <p className="text-success-text text-xs font-semibold tracking-wide uppercase">Fact</p>
          <p className="text-fg mt-1">{value.fact}</p>
        </div>
      </div>
    ),
    doctorQuestions: ({ value }) => (
      <div className="rounded-card border-default my-6 border p-5 print:break-inside-avoid">
        {value.title && <p className="text-fg-heading font-semibold">{value.title}</p>}
        <ul className="mt-3 space-y-2">
          {(value.questions ?? []).map((q: string, i: number) => (
            <li key={i} className="text-fg flex gap-2">
              <span aria-hidden>▢</span>
              {q}
            </li>
          ))}
        </ul>
      </div>
    ),
    videoEmbed: ({ value }) => (
      <figure className="my-8">
        <div className="rounded-card bg-muted relative aspect-video overflow-hidden">
          <video src={value.url} controls className="h-full w-full" />
        </div>
        {value.caption && (
          <figcaption className="text-fg-subtle mt-2 text-sm">{value.caption}</figcaption>
        )}
      </figure>
    ),
    button: ({ value }) =>
      value.cta?.link ? (
        <ButtonLink
          href={resolveHref(value.cta.link)}
          variant={value.cta.style ?? 'solid'}
          className="my-4"
        >
          {value.cta.link.label}
        </ButtonLink>
      ) : null,
  },
}

export function RichText({ value, className }: { value: RichTextValue; className?: string }) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
