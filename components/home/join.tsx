import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Hive } from "./hive";

/**
 * On wide screens: text and form in a left column, hive on the right.
 * On smaller screens: text, then hive, then form (see the `order-*` classes).
 */
export function Join() {
  return (
    <section
      id="join"
      className="grid gap-8 px-gutter-sm py-section-sm md:px-gutter md:py-[5.5rem] min-[1400px]:grid-cols-[minmax(0,420px)_820px] min-[1400px]:items-center min-[1400px]:justify-between min-[1400px]:gap-x-[72px]"
    >
      <div className="contents min-[1400px]:flex min-[1400px]:max-w-[420px] min-[1400px]:flex-col min-[1400px]:gap-8">
        <Reveal className="order-1 flex max-w-[420px] flex-col gap-4 md:gap-5">
          <Eyebrow>Join us</Eyebrow>
          <h2 className="text-h2-sm text-accent md:text-h2">Join the community.</h2>
          <p className="text-body text-muted md:text-[1.0625rem]">
            Meet others living with PMOS and be among the first in as we build this
            together. Every cell in the hive is a member, a story or a question.
          </p>
        </Reveal>

        {/* Not wired to a newsletter provider yet. That decision is still open (docs/02-open-questions.md). */}
        <Reveal as="form" delay={100} className="order-3 flex max-w-[420px] flex-col gap-2.5">
          <label htmlFor="email" className="text-[0.8125rem] font-medium">
            Email address
          </label>
          <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-3">
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="min-h-[52px] border border-ink bg-white px-4 text-body text-ink md:min-w-[200px] md:flex-[1_1_200px]"
            />
            <Button type="button">Join</Button>
          </div>
          <p className="text-[0.8125rem] leading-normal text-muted">
            Get the newsletter and hear first as we build this together. Unsubscribe
            any time.
          </p>
        </Reveal>
      </div>

      <div className="order-2">
        <Hive />
      </div>
    </section>
  );
}
