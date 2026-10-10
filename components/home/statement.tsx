import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function Statement() {
  return (
    <section className="flex flex-wrap gap-x-20 gap-y-10 px-gutter-sm pb-16 pt-section-sm md:px-gutter md:pb-20 md:pt-section">
      <Reveal className="flex-[1_1_220px]">
        <Eyebrow>Why we exist</Eyebrow>
      </Reveal>
      <Reveal delay={70} className="flex max-w-[900px] flex-[3_1_520px] flex-col gap-6 md:gap-8">
        <p className="text-statement-sm text-accent md:text-statement">
          Living with PMOS goes beyond symptoms. Another part of the experience
          deserves attention too: community.
        </p>
        <p className="max-w-[600px] text-body text-muted md:text-lead">
          Misinformation. Stigma. Delayed diagnosis. Gaps in care. Information
          that&apos;s hard to understand and harder to trust. Cysters in Action is a
          place to come together around all of it.
        </p>
      </Reveal>
    </section>
  );
}
