'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { RichText } from '@/components/portable-text'
import { Reveal } from '@/components/motion/reveal'
import type { FaqItemValue } from '@/lib/sanity/types'

function plainText(value: FaqItemValue['answer']): string {
  return value
    .map((block) =>
      'children' in block && Array.isArray(block.children)
        ? block.children.map((c: { text?: string }) => c.text ?? '').join('')
        : '',
    )
    .join(' ')
}

export function FaqBlock({ data }: { data: { heading?: string; items: FaqItemValue[] } }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: plainText(item.answer) },
    })),
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {data.heading && (
        <Reveal>
          <h2 className="font-display text-fg-heading text-3xl font-semibold">{data.heading}</h2>
        </Reveal>
      )}
      <Accordion.Root type="single" collapsible className="mt-6">
        {data.items.map((item, i) => (
          <Accordion.Item key={i} value={`item-${i}`} className="border-default border-b">
            <Accordion.Header>
              <Accordion.Trigger className="text-fg-heading flex w-full items-center justify-between py-4 text-left font-medium">
                {item.question}
                <span aria-hidden className="transition-transform data-[state=open]:rotate-45">
                  +
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden pb-4 data-[state=closed]:animate-none">
              <RichText value={item.answer} />
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  )
}
