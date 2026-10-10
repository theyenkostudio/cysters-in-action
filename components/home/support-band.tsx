import { Eyebrow } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/text-link";

export function SupportBand() {
  return (
    <section className="flex flex-col gap-5 bg-panel px-gutter-sm py-14 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-14 md:px-gutter md:py-16">
      <div className="flex max-w-[680px] flex-col gap-3">
        <Eyebrow>Support the cause</Eyebrow>
        <p className="text-pullquote-sm text-accent md:text-pullquote">
          Want to help this grow? Donating is always optional.
        </p>
      </div>
      <TextLink href="/donate" className="py-2 md:py-0">
        Donate
      </TextLink>
    </section>
  );
}
