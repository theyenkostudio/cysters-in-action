import { Eyebrow } from "@/components/ui/eyebrow";
import { Photo } from "@/components/ui/photo";
import { photos } from "@/lib/photos";

// Placeholder quotes, as in the design. Real stories only, with the member's consent.
const quote =
  "“[Member quote: a sentence or two, in their own words, shared with consent.]”";
const caption = "[First name] · [Years living with PMOS]";

const stories = [
  {
    src: photos.bench,
    alt: "A smiling woman in glasses talking with a friend on a bench",
    position: "55% 25%",
    tint: "bg-tint-blush",
  },
  {
    src: photos.womanMug,
    alt: "A smiling woman holding a mug among plants",
    position: "45% center",
    tint: "bg-tint-teal",
  },
  {
    src: photos.walking,
    alt: "Two women walking arm in arm in a park",
    position: "50% 35%",
    tint: "bg-tint-lilac",
  },
];

export function Voices() {
  return (
    <section
      id="voices"
      className="flex flex-col gap-8 px-gutter-sm py-section-sm md:gap-10 md:px-gutter md:py-section"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div className="flex flex-col gap-4">
          <Eyebrow>Member stories</Eyebrow>
          <h2 className="max-w-[760px] text-h2-sm text-accent md:text-h2">
            What living with PMOS is really like, from the people who live it.
          </h2>
        </div>
        <p className="max-w-[380px] text-body text-muted">
          Members share what diagnosis, daily life and finding support are like
          for them. Every story is shared with their consent.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-10">
        {stories.map((story) => (
          <figure key={story.alt} className="flex flex-col gap-4 md:flex-[1_1_300px] md:gap-5">
            <div className={`relative aspect-square overflow-hidden ${story.tint}`}>
              <Photo
                src={story.src}
                alt={story.alt}
                sizes="(min-width: 768px) 33vw, 100vw"
                position={story.position}
              />
            </div>
            <blockquote className="text-quote-sm text-accent md:text-quote">{quote}</blockquote>
            <figcaption className="text-[0.875rem] leading-normal text-muted">{caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
