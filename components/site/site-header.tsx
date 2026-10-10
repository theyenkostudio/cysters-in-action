"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav";

type SiteHeaderProps = {
  /**
   * overlay: sits over a hero photo (white text, no background) until you scroll. Used on the home page.
   * light:   always solid off-white with dark text. Used on pages that start with plain content.
   */
  tone?: "overlay" | "light";
  /** Path of the current page, so its link can be highlighted. */
  current?: string;
};

/**
 * Fixed header. Wordmark on the left; links and "Join the community" grouped on the right.
 * Pages using it need top padding to clear it: `pt-15 md:pt-18`.
 */
export function SiteHeader({ tone = "overlay", current }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const solid = tone === "light" || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-[60px] items-center justify-between border-b px-gutter-sm transition-colors duration-300 ease-settle md:h-auto md:flex-wrap md:gap-x-10 md:gap-y-4 md:px-gutter md:py-[22px]",
        solid ? "border-rule bg-ground text-ink" : "border-white/40 bg-transparent text-white",
      )}
    >
      <Link
        href="/"
        className="text-[1.0625rem] font-semibold tracking-[-0.01em] md:text-xl"
      >
        Cysters in Action
      </Link>

      <nav
        aria-label="Main"
        className="hidden flex-wrap items-center gap-x-9 gap-y-2 text-[0.9375rem] md:flex"
      >
        {navLinks.map((item) => {
          const isCurrent = item.href === current;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn("hover:underline", isCurrent && "font-semibold text-accent")}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/#join"
          className="font-medium underline underline-offset-4"
        >
          Join the community
        </Link>
      </nav>

      <MobileMenu />
    </header>
  );
}
