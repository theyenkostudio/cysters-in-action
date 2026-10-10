import type { Metadata } from "next";
import Link from "next/link";
import { DonateForm } from "@/components/donate/donate-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Photo } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Donate · Cysters in Action",
  description:
    "Support Cysters in Action. Donating is always optional, and there are other ways to help too.",
};

// Open decisions, shown as in the design. See docs/02-open-questions.md, "Donations".
const whereItGoes = [
  "[To confirm: what donations will fund, for example reviewing health content, running the community or campaigns.]",
  "[To confirm: the organisation's name and legal status, and whether donations are tax-deductible.]",
  "[To confirm: how donors get a receipt and how to change or cancel a monthly donation.]",
];

const otherWays = [
  { href: "/#join", label: "Join the community" },
  { href: "/connect", label: "Share your story" },
  { href: "/act", label: "Tell us what matters to you" },
];

export default function DonatePage() {
  return (
    <>
      <SiteHeader tone="light" current="/donate" />
      <main className="pt-15 md:pt-18">
        <section className="flex flex-col gap-5 px-gutter-sm pb-10 pt-14 md:flex-row md:flex-wrap md:items-end md:justify-between md:gap-x-20 md:gap-y-6 md:px-gutter md:pb-14 md:pt-22">
          <Reveal className="flex max-w-[860px] flex-col gap-5 md:flex-[1_1_560px]">
            <Eyebrow>Donate</Eyebrow>
            <h1 className="text-display-sm text-accent md:text-display">Support the cause.</h1>
          </Reveal>
          <Reveal
            as="p"
            delay={70}
            className="text-[1.0625rem] leading-[1.6] text-muted md:flex-[0_1_460px] md:text-lead"
          >
            Cysters in Action exists so people living with PMOS can learn, connect and
            act. Donating is always optional, and there are other ways to help too.
          </Reveal>
        </section>

        <Reveal kind="photo" className="relative h-[300px] overflow-hidden bg-tint-blush md:h-[520px]">
          <Photo
            src={photos.womanMug}
            alt="A smiling woman holding a white mug among plants"
            sizes="100vw"
            position="50% 40%"
          />
        </Reveal>

        <section className="flex flex-col gap-14 px-gutter-sm pb-16 pt-14 md:flex-row md:flex-wrap md:items-start md:gap-x-20 md:gap-y-14 md:px-gutter md:py-section">
          <DonateForm />

          <Reveal delay={70} className="flex flex-col gap-14 md:max-w-[560px] md:flex-[1_1_400px]">
            <div className="flex flex-col gap-4">
              <Eyebrow>Where your donation goes</Eyebrow>
              <div className="flex flex-col border-b border-rule">
                {whereItGoes.map((text) => (
                  <p
                    key={text}
                    className="border-t border-rule py-5 text-body leading-[1.6] md:text-[1.0625rem]"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Eyebrow>Other ways to help</Eyebrow>
              <div className="flex flex-col border-b border-rule">
                {otherWays.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="border-t border-rule py-[18px] text-xl font-medium text-accent hover:underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
