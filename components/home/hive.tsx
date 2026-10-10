import type { StaticImageData } from "next/image";
import { Photo } from "@/components/ui/photo";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/cn";

type Tint = "blush" | "teal" | "lilac";

type Cell = { x: number; y: number } & (
  | { kind: "photo"; src: StaticImageData; alt: string; position: string; caption?: string }
  | { kind: "tint"; tint: Tint; label: string }
  | { kind: "open" }
  | { kind: "queen" }
);

const tintClass: Record<Tint, string> = {
  blush: "bg-tint-blush",
  teal: "bg-tint-teal",
  lilac: "bg-tint-lilac",
};

const HEX = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

const alts = {
  cafe: "Two women talking across a café table",
  bench: "A woman in glasses smiling as she talks with a friend on a bench",
  journal: "A woman writing in a notebook",
  walking: "Two women walking arm in arm in a park",
  womanMug: "A smiling woman holding a white mug among plants",
  laughing: "Two women laughing together in warm purple light",
  mug: "Hands wrapped around a white mug resting on a book",
  hug: "Three friends in a close group hug",
  path: "Friends walking together arm in arm along a tree-lined path",
  phones: "Two friends laughing over their phones at a table",
  kitchen: "A woman chopping fresh vegetables in a bright kitchen",
};

// Pointy-top hexagons, laid out on a honeycomb grid. Coordinates are px inside the container.
const desktopCells: Cell[] = [
  { x: 3, y: 3.5, kind: "photo", src: photos.cafe, alt: alts.cafe, position: "25% center", caption: "Coffee and honest talk" },
  { x: 167, y: 3.5, kind: "tint", tint: "blush", label: "Share a story" },
  { x: 331, y: 3.5, kind: "photo", src: photos.bench, alt: alts.bench, position: "55% 25%", caption: "Say it out loud" },
  { x: 495, y: 3.5, kind: "photo", src: photos.journal, alt: alts.journal, position: "50% center", caption: "Write it down" },
  { x: 659, y: 3.5, kind: "open" },

  { x: 85, y: 145.5, kind: "photo", src: photos.walking, alt: alts.walking, position: "50% 40%", caption: "Walk it out" },
  { x: 249, y: 145.5, kind: "photo", src: photos.womanMug, alt: alts.womanMug, position: "45% center", caption: "Slow mornings" },
  { x: 413, y: 145.5, kind: "queen" },
  { x: 577, y: 145.5, kind: "photo", src: photos.laughing, alt: alts.laughing, position: "40% center", caption: "Laugh loudly" },

  { x: 3, y: 287.5, kind: "tint", tint: "teal", label: "Ask a question" },
  { x: 167, y: 287.5, kind: "photo", src: photos.mug, alt: alts.mug, position: "55% center", caption: "Take a minute" },
  { x: 331, y: 287.5, kind: "photo", src: photos.hug, alt: alts.hug, position: "40% center", caption: "Hold each other up" },
  { x: 495, y: 287.5, kind: "tint", tint: "lilac", label: "Find your people" },
  { x: 659, y: 287.5, kind: "photo", src: photos.path, alt: alts.path, position: "60% center", caption: "Together, outside" },

  { x: 85, y: 429.5, kind: "open" },
  { x: 249, y: 429.5, kind: "photo", src: photos.phones, alt: alts.phones, position: "50% center", caption: "Stay in touch" },
  { x: 413, y: 429.5, kind: "photo", src: photos.kitchen, alt: alts.kitchen, position: "75% center", caption: "Cook together" },
  { x: 577, y: 429.5, kind: "tint", tint: "blush", label: "Take action" },
];

const mobileCells: Cell[] = [
  { x: 3, y: 3.5, kind: "photo", src: photos.cafe, alt: alts.cafe, position: "25% center" },
  { x: 107, y: 3.5, kind: "tint", tint: "blush", label: "Share a story" },
  { x: 211, y: 3.5, kind: "photo", src: photos.bench, alt: alts.bench, position: "55% 25%" },

  { x: 55, y: 93.5, kind: "photo", src: photos.journal, alt: alts.journal, position: "50% center" },
  { x: 159, y: 93.5, kind: "photo", src: photos.womanMug, alt: alts.womanMug, position: "45% center" },

  { x: 3, y: 183.5, kind: "photo", src: photos.walking, alt: alts.walking, position: "50% 40%" },
  { x: 107, y: 183.5, kind: "queen" },
  { x: 211, y: 183.5, kind: "photo", src: photos.laughing, alt: alts.laughing, position: "40% center" },

  { x: 55, y: 273.5, kind: "photo", src: photos.mug, alt: alts.mug, position: "55% center" },
  { x: 159, y: 273.5, kind: "tint", tint: "teal", label: "Ask a question" },

  { x: 3, y: 363.5, kind: "photo", src: photos.hug, alt: alts.hug, position: "40% center" },
  { x: 107, y: 363.5, kind: "photo", src: photos.path, alt: alts.path, position: "60% center" },
  { x: 211, y: 363.5, kind: "tint", tint: "lilac", label: "Find your people" },

  { x: 55, y: 453.5, kind: "photo", src: photos.phones, alt: alts.phones, position: "50% center" },
  { x: 159, y: 453.5, kind: "photo", src: photos.kitchen, alt: alts.kitchen, position: "75% center" },
];

type Size = "lg" | "sm";

const dims = {
  lg: { w: 158, h: 182, sizes: "160px" },
  sm: { w: 98, h: 113, sizes: "100px" },
} as const;

function HexCell({ cell, size }: { cell: Cell; size: Size }) {
  const { w, h, sizes } = dims[size];
  const lg = size === "lg";
  const base = "group absolute block overflow-hidden";
  const style = { left: cell.x, top: cell.y, width: w, height: h, clipPath: HEX };

  if (cell.kind === "photo") {
    return (
      <a href="#email" className={base} style={style}>
        <Photo
          src={cell.src}
          alt={cell.alt}
          sizes={sizes}
          position={cell.position}
          className="transition-transform duration-[600ms] ease-settle group-hover:scale-[1.12] group-focus-visible:scale-[1.12]"
        />
        {lg && cell.caption && (
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(20,12,22,0.78)] to-transparent px-5 pb-[34px] pt-11 text-center text-[0.8125rem] font-medium leading-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            {cell.caption}
          </span>
        )}
      </a>
    );
  }

  if (cell.kind === "tint") {
    return (
      <a
        href="#email"
        className={cn(
          base,
          "flex items-center justify-center text-center font-medium transition-[filter] duration-300 hover:brightness-95",
          tintClass[cell.tint],
          lg ? "px-[30px] text-[1.0625rem] leading-tight" : "px-[18px] text-[0.8125rem] leading-tight",
        )}
        style={style}
      >
        {cell.label}
      </a>
    );
  }

  if (cell.kind === "open") {
    return (
      <a
        href="#email"
        aria-label="A place waiting for you"
        className={cn(base, "flex items-center justify-center bg-panel text-[2.125rem] text-quiet")}
        style={style}
      >
        +
      </a>
    );
  }

  return (
    <a
      href="#email"
      className={cn(base, "flex flex-col items-center justify-center bg-accent text-center text-accent-ink", lg ? "gap-1.5" : "gap-1")}
      style={style}
    >
      <span className={cn("font-medium", lg ? "text-[2.125rem] tracking-[-0.01em]" : "text-2xl")}>You?</span>
      <span
        className={cn(
          "font-medium uppercase tracking-[0.12em]",
          lg ? "text-[0.6875rem]" : "text-[0.5625rem]",
        )}
      >
        Join the hive
      </span>
    </a>
  );
}

/** The community "hive". A large version for wide screens and a smaller one for phones. */
export function Hive() {
  return (
    <>
      <div className="relative hidden h-[615px] w-[820px] max-w-full lg:block">
        {desktopCells.map((cell) => (
          <HexCell key={`${cell.x}-${cell.y}`} cell={cell} size="lg" />
        ))}
      </div>
      <div className="relative mx-auto h-[570px] w-[312px] lg:hidden">
        {mobileCells.map((cell) => (
          <HexCell key={`${cell.x}-${cell.y}`} cell={cell} size="sm" />
        ))}
      </div>
    </>
  );
}
