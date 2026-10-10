import { Eyebrow } from "@/components/ui/eyebrow";
import { Photo } from "@/components/ui/photo";
import { TextLink } from "@/components/ui/text-link";
import { photos } from "@/lib/photos";

export function Hero() {
  return (
    <section className="relative flex min-h-[640px] flex-col overflow-hidden bg-[#5b4a5c] text-white md:min-h-[780px]">
      <Photo
        src={photos.cafe}
        alt="Two women talking across a café table, smiling at each other"
        sizes="100vw"
        priority
        quality={90}
        className="hero-settle object-[28%_center] md:object-[center_35%]"
      />
      {/* Darkens the top (for the nav) and bottom (for the headline) so white text stays readable. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,12,22,0.55)_0%,rgba(20,12,22,0)_22%,rgba(20,12,22,0)_30%,rgba(20,12,22,0.78)_100%)] md:bg-[linear-gradient(to_bottom,rgba(20,12,22,0.55)_0%,rgba(20,12,22,0)_28%,rgba(20,12,22,0)_40%,rgba(20,12,22,0.72)_100%)]"
      />

      <div className="relative flex flex-1 flex-col justify-end gap-4 px-gutter-sm pb-9 md:gap-6 md:px-gutter md:pb-14">
        <Eyebrow accent={false}>PMOS (formerly PCOS)</Eyebrow>
        <h1 className="max-w-[760px] text-hero-sm md:text-hero">
          Living with PMOS goes beyond symptoms. So does community.
        </h1>
        <p className="max-w-[560px] text-body leading-normal md:text-hero-lead">
          <span className="md:hidden">A space to learn, connect and act, together.</span>
          <span className="hidden md:inline">
            A space to learn from information you can trust, connect with people who
            understand, and act for better care.
          </span>
        </p>
        <TextLink href="/#join" className="py-2 md:py-0">
          Join the community
        </TextLink>
      </div>
    </section>
  );
}
