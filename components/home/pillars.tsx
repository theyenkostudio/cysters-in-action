import Link from "next/link";
import { Photo, PhotoSlot } from "@/components/ui/photo";
import { TextLinkLabel } from "@/components/ui/text-link";
import { photos } from "@/lib/photos";

const card = "group flex flex-col gap-4 md:flex-[1_1_300px] md:gap-5";
const title = "text-h3 text-accent md:text-card";
const body = "max-w-[400px] text-body leading-[1.55] text-muted";

export function Pillars() {
  return (
    <section className="px-gutter-sm pb-section-sm md:px-gutter md:pb-section">
      <div className="flex flex-col gap-12 md:flex-row md:flex-wrap md:gap-6">
        <Link href="/learn" className={card}>
          <div className="relative aspect-[4/5] overflow-hidden bg-tint-teal">
            <Photo
              src={photos.mug}
              alt="Hands wrapped around a white mug resting on a book"
              sizes="(min-width: 768px) 33vw, 100vw"
              position="55% center"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className={title}>Learn</div>
            <div className={body}>
              Reliable health information and shared experience, in words you can
              understand and trust.
            </div>
            <TextLinkLabel className="mt-2">Start learning</TextLinkLabel>
          </div>
        </Link>

        <Link href="/connect" className={card}>
          <div className="relative aspect-[4/5] overflow-hidden bg-tint-blush">
            <Photo
              src={photos.bench}
              alt="A smiling woman in glasses talking with a friend on an outdoor bench"
              sizes="(min-width: 768px) 33vw, 100vw"
              position="center 30%"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className={title}>Connect</div>
            <div className={body}>
              Meet others who understand parts of the journey, whatever stage
              you&apos;re at.
            </div>
            <TextLinkLabel className="mt-2">Meet the community</TextLinkLabel>
          </div>
        </Link>

        <Link href="/act" className={card}>
          {/* No group photo chosen yet. Same placeholder as the design. */}
          <PhotoSlot
            label="Photo slot · a group together, shoulder to shoulder, facing the camera"
            className="aspect-[4/5] bg-tint-lilac p-4 md:p-5"
          />
          <div className="flex flex-col gap-2">
            <div className={title}>Act</div>
            <div className={body}>
              Speak up on what matters to us and push for better awareness,
              understanding and care.
            </div>
            <TextLinkLabel className="mt-2">Take action</TextLinkLabel>
          </div>
        </Link>
      </div>
    </section>
  );
}
