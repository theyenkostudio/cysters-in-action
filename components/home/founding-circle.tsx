import { Eyebrow } from "@/components/ui/eyebrow";
import { Photo } from "@/components/ui/photo";
import { TextLink } from "@/components/ui/text-link";
import { photos } from "@/lib/photos";

export function FoundingCircle() {
  return (
    <section className="flex flex-col bg-panel md:flex-row md:flex-wrap">
      <div className="relative h-[360px] overflow-hidden bg-tint-teal md:h-auto md:min-h-[560px] md:flex-[1_1_520px]">
        <Photo
          src={photos.womanMug}
          alt="A smiling woman holding a white mug, surrounded by plants in warm light"
          sizes="(min-width: 768px) 50vw, 100vw"
          position="45% center"
        />
      </div>
      <div className="flex flex-col gap-5 px-gutter-sm pb-14 pt-12 md:flex-[1_1_520px] md:justify-center md:gap-7 md:px-14 md:py-20">
        <Eyebrow>The Founding Circle</Eyebrow>
        <p className="max-w-[520px] text-pullquote-sm text-accent md:text-pullquote">
          The first step is taken. Now the listening, learning and building
          together starts.
        </p>
        <TextLink href="/about" className="py-2 md:py-0">
          Meet the circle
        </TextLink>
      </div>
    </section>
  );
}
