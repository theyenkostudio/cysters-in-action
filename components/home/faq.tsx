import { Eyebrow } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/text-link";

// Answers marked [To confirm] are open decisions. See docs/07-landing-faq-and-voices.md.
const faq = [
  {
    q: "What is PMOS, and is it the same as PCOS?",
    a: "PMOS (polyendocrine metabolic ovarian syndrome) is the new name for PCOS, announced in May 2026. It describes the same condition, and diagnosis and treatment haven't changed. The name is being phased in over about three years.",
  },
  {
    q: "Why was the name changed?",
    a: "The old name focused on the ovaries, but the condition also affects hormones and metabolism, and many people diagnosed don't have polycystic ovaries. [Clinician to review this wording.]",
  },
  {
    q: "Who is Cysters in Action for?",
    a: "[To confirm: people living with PMOS at any stage, plus family and supporters?]",
  },
  {
    q: "Who runs it?",
    a: "A Founding Circle of people living with PMOS has taken the first step. [Add names and roles once agreed.]",
  },
  {
    q: "Is this medical advice?",
    a: "No. What we share is for education and community support. Please speak to your healthcare provider about your own care.",
  },
  {
    q: "Who checks the health information?",
    a: "[To confirm: who reviews content, how, and how often it is updated.]",
  },
  {
    q: "What happens to my email and my photos?",
    a: "[To confirm: privacy policy, how photos are stored and whether you can stay anonymous.]",
  },
  {
    q: "How do I get involved?",
    a: "Join the newsletter for now. We'll share ways to tell your story and take action together as we build this.",
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="flex flex-col gap-7 px-gutter-sm pb-section-sm md:flex-row md:flex-wrap md:gap-x-20 md:gap-y-10 md:px-gutter md:pb-section"
    >
      <div className="flex flex-col gap-4 md:max-w-[380px] md:flex-[1_1_280px]">
        <Eyebrow>Questions</Eyebrow>
        <h2 className="text-h2-sm text-accent md:text-h2">Frequently asked questions.</h2>
        <p className="hidden text-body text-muted md:block">
          Can&apos;t find yours? Tell us and we&apos;ll add it.
        </p>
        <TextLink href="#email" className="hidden md:inline">
          Ask a question
        </TextLink>
      </div>

      <div className="border-b border-rule md:max-w-[860px] md:flex-[2_1_520px]">
        {faq.map((item, i) => (
          // Same `name` makes the group exclusive: opening one closes the others.
          <details key={item.q} name="faq" open={i === 0} className="faq-item group border-t border-rule">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-question-sm md:gap-6 md:py-6 md:text-question [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <span aria-hidden="true" className="flex-none text-2xl font-normal text-accent md:text-[1.625rem]">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">&minus;</span>
              </span>
            </summary>
            <div className="faq-answer max-w-[700px] pb-6 text-[0.9375rem] leading-[1.65] text-muted md:pb-7 md:pr-14 md:text-body">
              {item.a}
            </div>
          </details>
        ))}
      </div>

      <TextLink href="#email" className="py-2 md:hidden">
        Can&apos;t find yours? Ask a question
      </TextLink>
    </section>
  );
}
