import Link from "next/link";
import { navLinks } from "./nav";

export function SiteFooter() {
  return (
    <footer className="grid gap-7 border-t border-rule px-gutter-sm pb-12 pt-10 md:grid-cols-[minmax(0,420px)_auto] md:justify-between md:gap-x-20 md:gap-y-3 md:px-gutter md:pb-10 md:pt-12">
      <div className="text-lg font-semibold tracking-[-0.01em] md:col-start-1 md:row-start-1 md:text-xl">
        Cysters in Action
      </div>

      <nav
        aria-label="Footer"
        className="order-2 flex flex-wrap gap-x-6 gap-y-1 text-[0.9375rem] md:col-start-2 md:row-span-2 md:row-start-1 md:items-start md:gap-x-8 md:gap-y-3 md:text-[0.875rem]"
      >
        {navLinks.map((item) => (
          <Link key={item.href} href={item.href} className="py-2.5 hover:underline md:py-0">
            {item.label}
          </Link>
        ))}
        <a href="#" className="py-2.5 hover:underline md:py-0">
          Privacy
        </a>
        <a href="#" className="py-2.5 hover:underline md:py-0">
          Contact
        </a>
      </nav>

      <p className="order-3 text-[0.8125rem] leading-relaxed text-muted md:order-none md:col-start-1 md:row-start-2 md:text-[0.875rem]">
        Information shared here is for education and community support. It isn&apos;t
        medical advice. Please speak to your healthcare provider about your own
        care.
      </p>
    </footer>
  );
}
