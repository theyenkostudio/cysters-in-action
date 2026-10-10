# Handoff: where we are

Last updated: 2026-10-10 (end of day one).

## Where things are
- **Design (source of truth):** https://claude.ai/artifact/DqWU7Q1DL9EcJHHDR3d9N6. A canvas with every page on desktop and mobile. A saved copy of the page files is in `design/prototype/` (see `design/README.md`).
- **App:** Next.js 16.4, React 19.3, Tailwind 4, pnpm. Code in `app/`, `components/`, `lib/`. Tokens in `app/globals.css`, documented in [10-design-tokens.md](10-design-tokens.md).
- **Docs:** this folder. Start with [README.md](README.md).
- **Next.js version warning:** `AGENTS.md` says this Next.js has breaking changes. Read the guide in `node_modules/next/dist/docs/` before using an API from memory.
- **Run it:** `pnpm dev`. Check with `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`.

## Built in the app
| Page | Status |
|------|--------|
| Home (`/`) | Built, matches the design on desktop and mobile |
| Donate (`/donate`) | Built. The form is a prototype and charges nothing. |
| Mobile menu | Built (native dialog) |
| Learn, Connect, Act, About | **Designed, not built.** Links to them 404. |
| Privacy, Contact | Not designed, not built |

Shared pieces so far: `SiteHeader` (fixed, `tone="overlay"` for the hero or `"light"` for plain pages, plus `current`), `SiteFooter`, `MobileMenu`, `Hero`, `Eyebrow`, `TextLink`, `Button`, `Photo`, `Reveal`, `Hive`, `Faq`.

Motion is built as in [08-motion.md](08-motion.md): scroll reveals, hive ripple, hero settle, FAQ easing, header colour change, link and button touches, cross-fade between pages.

## Checked
- Lint, type-check and production build pass.
- In a headless browser, on the home page: scroll reveals, the fixed header changing colour, smooth scroll, the exclusive FAQ with animation, the mobile menu opening and closing, and no sideways overflow at 390px.
- **Not yet seen in a browser:** the Donate page and the cross-fade between pages. Click between Home and Donate to check.

## SEO
Built. The site is hidden from search engines until `NEXT_PUBLIC_SITE_URL` and `SEO_INDEXABLE=true` are set. See [12-seo.md](12-seo.md).

## Known gaps
- The newsletter form isn't connected to anything (provider not chosen).
- The Act card on the home page shows the "Photo slot" placeholder, as in the design.
- All photos are Unsplash stock stand-ins. Check each licence before launch and replace with real community photography.
- Voices quotes and many FAQ answers are placeholders marked **[To confirm]**. They would show on a live site.
- The header and footer are rendered per page. When more pages exist, consider moving them into layouts.
- Below 1400px wide the join hive stacks under the text instead of sitting beside it. The design only shows 1440px and 390px.

## Suggested next steps
1. Look at Donate and the page fade in a browser and fix anything off.
2. Build Learn, Connect, Act and About from the designs, reusing the header (`tone="light"`), footer, `Reveal` and `Photo`.
3. Update [09-site-pages.md](09-site-pages.md) as pages land.
4. Mobile versions are already in the design for every page.

## Decisions still open (see [02-open-questions.md](02-open-questions.md))
- What "and more" meant in the promises already made to the Founding Circle.
- MVP scope: curated site first, or a thin community app with accounts and photos.
- Newsletter provider and who writes it.
- Donations: legal status, payment provider, currency, what funds are used for.
- Who reviews the health content, privacy and anonymity rules, moderation.
- Brand: whether fonts, a logo and colours already exist. Hanken Grotesk and the plum accent were my choices for the prototype.
- Photography: where real photos come from, and consent.
