import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

type PhotoProps = {
  src: StaticImageData;
  alt: string;
  sizes: string;
  /** CSS object-position, for example "55% center". */
  position?: string;
  priority?: boolean;
  /** 75 (default) or 90. Allowed values are set in next.config.ts. */
  quality?: 75 | 90;
  className?: string;
};

/** Fills its parent. The parent must be `relative` and have a size. */
export function Photo({ src, alt, sizes, position, priority, quality, className }: PhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      quality={quality}
      fill
      className={cn("object-cover", className)}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}

/** Tinted block with a label, shown where a real photo hasn't been chosen yet. */
export function PhotoSlot({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex items-end", className)}>
      <span className="max-w-60 text-[0.625rem] uppercase leading-normal tracking-[0.1em] md:text-[0.6875rem]">
        {label}
      </span>
    </div>
  );
}
