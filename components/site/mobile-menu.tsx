"use client";

import Link from "next/link";
import { useRef } from "react";
import { Photo } from "@/components/ui/photo";
import { photos } from "@/lib/photos";
import { menuLinks } from "./nav";

/** Hamburger button and full-screen menu. Uses a native dialog for focus handling. */
export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => dialog.current?.showModal()}
        className="-mr-3 flex cursor-pointer flex-col gap-1.5 p-3 md:hidden"
      >
        <span className="block h-[1.5px] w-[22px] bg-current" />
        <span className="block h-[1.5px] w-[22px] bg-current" />
      </button>

      <dialog
        ref={dialog}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-ground p-0 text-ink backdrop:bg-transparent"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[60px] flex-none items-center justify-between border-b border-rule px-gutter-sm">
            <Link
              href="/"
              onClick={close}
              className="text-[1.0625rem] font-semibold tracking-[-0.01em]"
            >
              Cysters in Action
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="-mr-3 flex size-11 cursor-pointer items-center justify-center"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                aria-hidden="true"
              >
                <path d="M4 4 L18 18 M18 4 L4 18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-none flex-col px-gutter-sm pt-2">
            {menuLinks.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={
                  "flex items-center justify-between gap-4 py-5 " +
                  (i < menuLinks.length - 1 ? "border-b border-ink/20" : "")
                }
              >
                <span className="flex flex-col gap-1">
                  <span className="text-h2-sm text-accent">{item.label}</span>
                  <span className="text-[0.875rem] leading-snug text-muted">{item.note}</span>
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M3 10 H17 M11 4 L17 10 L11 16" />
                </svg>
              </Link>
            ))}
          </nav>

          <div className="relative mx-gutter-sm mt-3 min-h-[120px] flex-1 overflow-hidden bg-tint-blush">
            <Photo
              src={photos.bench}
              alt="A smiling woman in glasses talking with a friend on an outdoor bench"
              sizes="100vw"
              position="center 30%"
            />
          </div>

          <div className="flex flex-none flex-col gap-1.5 px-gutter-sm pb-7 pt-5">
            <Link
              href="/#join"
              onClick={close}
              className="flex min-h-[52px] items-center justify-center bg-accent text-link uppercase text-accent-ink"
            >
              Join the community
            </Link>
            <div className="flex gap-6 text-[0.875rem]">
              <Link href="/donate" onClick={close} className="block py-2.5 font-medium">
                Donate
              </Link>
              <a href="#" className="block py-2.5 text-muted">
                Privacy
              </a>
              <a href="#" className="block py-2.5 text-muted">
                Contact
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
