"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "figure" | "form" | "p";
  /**
   * rise:  fades in and rises a little (text, cards).
   * photo: the container fades in while the photo inside eases from slightly zoomed to full size.
   * hive:  the cells inside ripple in from the centre (each `.hive-cell` sets its own delay).
   */
  kind?: "rise" | "photo" | "hive";
  /** Delay in ms, for staggering siblings. */
  delay?: number;
};

/**
 * Settles its children into view once, the first time they scroll into view.
 * See docs/08-motion.md.
 *
 * Safe by default: the server renders everything visible. Only after load, and only for blocks that are
 * below the fold, does it hide them and wait. Anything already on screen is never hidden, and with
 * reduced motion on (or no JavaScript) nothing is hidden at all.
 */
export function Reveal({
  as = "div",
  kind = "rise",
  delay = 0,
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const Component = as as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    // Already on screen (or scrolled past): leave it alone.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      data-reveal-kind={kind}
      className={className}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Component>
  );
}
