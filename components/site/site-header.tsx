"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav";

/**
 * Fixed header. At the top of the page it sits over the hero photo (white text, no background).
 * Once you scroll, it turns solid off-white with dark text so it stays readable over any section.
 * Wordmark on the left; links and "Join the community" grouped on the right.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-[60px] items-center justify-between border-b px-gutter-sm transition-colors duration-300 ease-settle md:h-auto md:flex-wrap md:gap-x-10 md:gap-y-4 md:px-gutter md:py-[22px]",
        scrolled ? "border-rule bg-ground text-ink" : "border-white/40 bg-transparent text-white",
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
        {navLinks.map((item) => (
          <Link key={item.href} href={item.href} className="hover:underline">
            {item.label}
          </Link>
        ))}
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
