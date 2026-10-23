import { Reveal } from '@/components/motion/reveal'
import type { TestimonialRef } from '@/lib/sanity/types'

export function TestimonialBlock({ data }: { data: { testimonials: TestimonialRef[] } }) {
  const testimonial = data.testimonials[0]
  if (!testimonial) return null

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-8">
      <Reveal>
        <p aria-hidden className="font-display text-accent-orchid text-5xl">
          “
        </p>
        <blockquote className="font-display text-fg-heading text-2xl leading-snug font-medium sm:text-3xl">
          {testimonial.quote}
        </blockquote>
        <p className="text-fg-muted mt-4 text-sm font-semibold">
          {testimonial.attribution}
          {testimonial.role && <span className="font-normal"> · {testimonial.role}</span>}
        </p>
      </Reveal>
    </section>
  )
}
