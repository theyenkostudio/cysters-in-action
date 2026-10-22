# Cysters In Action — Website Build Spec

Oct 22, 2026 · Prepared by Yenko Studio

## 1. Overview

We will build the Cysters In Action website (domain TBC) as a Next.js site with Sanity CMS, shipping in 7 phases (0–6): Core and Community features at launch, Future Enhancements after. Every piece of copy, imagery, video, link and contact detail is editable in Sanity without a developer.

**Mission the site serves:** support people living with PMOS through reliable health information, genuine community and collective action. The three pillars **Learn, Connect, Act** drive the navigation, the homepage and the CMS model.

### Decisions confirmed

| Topic | Decision |
| --- | --- |
| Organisation name | Cysters In Action (used everywhere: site, Studio, metadata) |
| Feature scope | All features in the selection sheet. Core + Community ship at launch; Future Enhancements ship in Phase 6, but their schemas are designed now |
| Frontend | Next.js (App Router, TypeScript) |
| CMS | Sanity (hosted Content Lake + embedded Studio at /studio) |
| Design blueprint | Radiating Hope, improved; editorial touches from The IWH |
| Brand | Logo from the client. Colours extracted from the launch flyer (Section 4, Colour system). The flyer's fonts are not used; site fonts are set in theme.config.ts |
| Email provider | Not decided. Built behind a provider-agnostic adapter; Brevo recommended, Mailchimp supported |

### Feature list (from the selection sheet)

| Feature | Group | Phase |
| --- | --- | --- |
| Newsletter signup | Core | 3 |
| Learn hub (articles, myth-busting, doctor-question guides) | Core | 2 |
| About / Mission page (incl. Founding Circle) | Core | 2 |
| Contact page | Core | 3 |
| Share your story (moderated, anonymous option) | Community | 4 |
| Events page (calendar, RSVP, add-to-calendar) | Community | 4 |
| Glossary | Community | 4 |
| Community guidelines | Community | 2 |
| Expert directory | Future | 6 |
| Volunteer / partner signup | Future | 6 |
| Donation page | Future | 6 |

### Assumptions

- Content is English-only at launch; the schema is i18n-ready (document-level) so a second language can be added later.
- The client supplies the logo as SVG (full colour, one colour and reversed) before Phase 1 starts. Colours are already defined in Section 4.
- Hosting on Vercel; the client owns the Vercel, Sanity, domain and email-provider accounts, with Yenko Studio invited as admin.
- Health content is written or reviewed by the client's team; the site shows a medical-reviewer and last-reviewed date on Learn content.

### Out of scope

- User accounts, logins or a member area.
- A live forum or chat. Community happens through stories, events and the newsletter.
- Payment processing before Phase 6.
- Native mobile apps.

## 2. Reference analysis

Radiating Hope gives us the page skeleton and interaction feel; The IWH gives us the editorial, problem-to-solution storytelling. We keep Radiating Hope's structure and fix its weak spots.

### What we take from Radiating Hope (blueprint)

| Element on Radiating Hope | How Cysters In Action uses it |
| --- | --- |
| Slim announcement bar above the nav with a coloured label pill and arrow link | CMS-driven announcement bar (label, text, link, start/end dates, dismissible) |
| Full-bleed hero with background video/photo, dark gradient on the left, large 3-line headline bottom-left, two pill CTAs (solid + outline) | Same layout. Hero media, headline, subline and both CTAs editable per page |
| Floating pill navigation with mega-dropdowns where each link has a title + one-line description | Nav grouped as Learn / Connect / Act, each item with title + description + optional icon; managed in Sanity |
| "Ask for help" text link + white pill "Contact us" on the right of the nav | "Get support" text link + "Join the newsletter" pill (both editable) |
| Large mission statement paragraph under the hero, with a "Our story" eyebrow | Mission statement block with word-by-word reveal on scroll |
| Impact stat beside a dotted world map | Stats band (e.g. members, stories shared, events held) with count-up numbers |
| "Four ways to help" card grid | "Learn, Connect, Act" pillar cards linking to each section |
| Upcoming events list with tabs by category and "Save my spot" | Events list with type tabs (Webinar, Meetup, Q&A), RSVP and add-to-calendar |
| Inspiring Stories carousel | Community stories carousel fed by approved submissions |
| Latest news cards | Latest from the Learn hub |
| Big closing CTA with image | Closing CTA block ("Share your story" or newsletter) |
| Four-column footer: About / Events / Get involved / More, legal row, socials | Same structure, with columns, socials, address and contact from Site Settings |

### What we take from The IWH

- **Problem → solution narrative**: an eyebrow ("The problem"), a bold statement, short body copy, then "We're doing something about it". We use this on the About page and as an optional homepage block.
- **Two-line display headlines** split across lines for rhythm ("When women thrive, / we all do").
- **Pull-quote testimonials** with attribution, presented one at a time.
- **Resource cards with category label** (News, Op-Ed) and a "Read article" link. Our version labels Learn articles by type (Explainer, Myth-buster, Doctor guide).
- **Footer with address, phone and email set out plainly**, plus a newsletter signup.
- **Newsletter modal/slide-in** with a success state.

### What we improve on Radiating Hope

1. **Content is truly editable.** Several RH sections show placeholder text ("This is some text inside of a div block", "Announcement: Enter your text here") and dead links to google.com. Every block in our build is schema-validated, and required fields block publishing when empty.
2. **Past events stop being promoted.** RH lists 2023–2025 events as upcoming. Our queries filter by date, and past events move to an archive automatically.
3. **Accessibility.** WCAG 2.2 AA: hero text contrast guaranteed with a CMS-controlled overlay, keyboard-operable mega menus, captions on hero video, a pause control for motion.
4. **Performance.** Hero video served as a compressed MP4/WebM with a poster image, lazy-loaded below the fold, and disabled on slow connections (Save-Data).
5. **Trust signals for health content**: medically-reviewed-by, last-reviewed date, sources and a disclaimer on every Learn article.
6. **Privacy-first community features**: anonymous story submissions, consent checkboxes, no third-party trackers before consent.
7. **Smarter motion.** RH's motion is mostly fades. We add a deliberate motion system with two intensities (Section 4).

## 3. Tech stack and architecture

One Next.js app on Vercel serves the site and embeds Sanity Studio at /studio; content is fetched with GROQ, cached by tag, and revalidated instantly by a Sanity webhook on publish.

```
Editors (Studio /studio) --publish--> Sanity Content Lake --webhook--> Next.js on Vercel --pages--> Visitors
                                             ^                          (cached by tag)               |
                                             |  drafts via server-only token                          | forms
                                             |                                                        v
                         Email provider <--subscribe-- Server Actions (Zod, Turnstile, rate limits) <--+
                         (Brevo/Mailchimp via adapter)
```

Content flows left to right on publish; form submissions flow back through Server Actions into Sanity (as drafts) and the email provider.

### Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js, latest stable at kickoff (App Router, React Server Components, TypeScript strict) | Pin the exact version in Phase 0 |
| CMS | Sanity Studio (latest major) embedded at /studio, `next-sanity` toolkit | Presentation tool for visual editing and draft preview |
| Data fetching | GROQ via `defineQuery`, Sanity TypeGen for typed results | `sanityFetch` wrapper with cache tags per document type |
| Images | `@sanity/image-url` + `next/image`, hotspot/crop, LQIP blur placeholders | AVIF/WebP automatic |
| Video | Sanity file assets (MP4/WebM, max \~15 MB) or Mux plugin if videos exceed that | Poster image required |
| Styling | Tailwind CSS with design tokens as CSS variables | shadcn/ui-style primitives built on Radix for menus, dialogs, tabs |
| Animation | Motion (motion.dev, formerly Framer Motion) for component and layout animation; GSAP + ScrollTrigger + SplitText for scroll-driven and text animation; Lenis for smooth scroll | See Section 4 |
| Forms | React Hook Form + Zod, submitted to Next.js Server Actions | Shared Zod schemas client and server |
| Spam protection | Cloudflare Turnstile + honeypot field + rate limiting (Upstash Redis) |  |
| Email | Provider adapter (Brevo recommended) + transactional email via Resend or the provider's API | Section 7 |
| Calendar | `ics` package for .ics files; Google/Outlook deep links |  |
| Search | GROQ text search across Learn + Glossary (Phase 5) | Algolia only if content passes \~500 docs |
| Analytics | Plausible or Vercel Web Analytics (cookieless) | Avoids a consent banner for analytics |
| Hosting | Vercel (Production, Preview per PR) | Custom domain, HTTPS |
| Quality | ESLint, Prettier, Vitest, Playwright, axe-core, Lighthouse CI, GitHub Actions |  |

### Repository layout

```
/app
  /(site)              public pages, shared layout (announcement bar, nav, footer)
    /page.tsx          homepage
    /learn/...         Learn hub, article, category, glossary
    /connect/...       stories, share-your-story, events, guidelines
    /act/...           volunteer, partners, donate, experts (Phase 6)
    /about, /contact, /[slug]  generic CMS pages
  /studio/[[...tool]]  embedded Sanity Studio
  /api/revalidate      Sanity webhook → revalidateTag
  /api/draft-mode      enable/disable draft mode for Presentation
  /api/ics/[eventId]   .ics download
/components
  /blocks              one component per page-builder block
  /ui                  primitives (Button, Card, Dialog, Tabs...)
  /motion              animation wrappers (Reveal, SplitHeadline, Marquee...)
/lib
  /sanity              client, queries, fetch helper, image builder
  /forms               zod schemas, server actions, email adapter
/sanity
  /schemaTypes         documents, objects, blocks, singletons
  /structure           Studio desk structure
  sanity.config.ts
```

### Environments and content datasets

| Environment | Next.js | Sanity dataset | Purpose |
| --- | --- | --- | --- |
| Local | localhost | development | Building and schema work |
| Preview | Vercel preview per PR | development | Review of features before merge |
| Staging | staging.domain | production (draft perspective) | Client content entry and UAT |
| Production | domain | production (published) | Live site |

### Rendering and caching rules

- All public pages are statically rendered and cached with tags (`page`, `article`, `event`, `story`, `siteSettings`...).
- A Sanity GROQ-powered webhook calls `/api/revalidate` on publish, verified by a shared secret, and revalidates the matching tags.
- Events pages also revalidate every hour so "upcoming" vs "past" stays correct without a publish.
- Draft mode + Presentation tool lets editors click any element on a preview page and jump to the field in Studio.

## 4. Design system and animation

The flyer's colours become a token layer, configured from one file; components consume only tokens, and motion follows one rule: subtle by default, exaggerated only at the five "moments" listed below.

### Design tokens

| Token group | Contents | Implementation |
| --- | --- | --- |
| Colour | 7 tonal scales from the flyer, semantic tokens, status colours, overlay (see Colour system below) | CSS variables in `globals.css`, mapped in Tailwind config; contrast-checked pairs only (AA ≥ 4.5:1 body, 3:1 large text) |
| Typography | Display font (headlines) and text font (body), chosen for the site, not taken from the flyer | `next/font/local` or next/font/google, as set in theme.config.ts, `font-display: swap`; fluid sizes with `clamp()` from 16px body to \~88px hero |
| Type scale | display-xl, display-l, h1–h4, body-l, body, small, eyebrow | Display sizes use tight leading (1.0–1.05) like the RH hero |
| Radius | pill (999px) for buttons/nav, 24px cards, 12px inputs | Matches RH's pill CTAs and floating nav |
| Spacing | 4px base, section padding 96–160px desktop / 64px mobile |  |
| Elevation | Flat surfaces; blur-glass only on the floating nav | `backdrop-filter: blur(16px)` with solid fallback |
| Motion | Durations (150 / 300 / 600 / 1200ms), easings (`out-expo`, `in-out-quart`, spring presets) | Exported from `/lib/motion/tokens.ts` |

### Colour system

Six seed colours and a cream canvas were sampled from the Cysters In Action launch flyer; each seed expands into an 11-step scale, and components only ever use semantic tokens. Everything is set in one file, `theme/theme.config.ts`, with optional `.env` overrides. The flyer's typefaces are not used.

#### Palette extracted from the flyer

Values are pixel averages of the dominant colour cluster in each region of the flyer.

| Role | Name | Seed | Where it appears on the flyer |
| --- | --- | --- | --- |
| Primary ink | Teal | `#134D64` | "Cysters" wordmark, "Officially Begins" |
| Dark surface | Plum | `#4E1F4C` | Top-left and bottom-right waves |
| Accent | Lagoon | `#0394A2` | Bright teal wave, bottom right |
| Accent | Orchid | `#9F71BA` | Dot over the "y", divider dot |
| Soft surface | Blush | `#F3D3DE` | "Officially Begins" pill |
| Soft surface | Lilac | `#D0BBD5` | Misty wave on the left edge |
| Canvas | Cream | `#FDFDF8` | Flyer background |
| Neutral | Plum-grey | Derived from plum's hue at low chroma | Divider rules (sampled `#918A91`) |

#### Tonal scales

Generated in OKLCH so steps look evenly spaced. **Bold** = the exact flyer seed, kept unchanged at its step.

| Step | teal | lagoon | plum | orchid | blush | lilac | neutral |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 |  |  |  |  |  |  | `#FDFDF8` (cream) |
| 50 | `#F0F8FC` | `#EEF9FB` | `#FDF3FC` | `#FAF4FE` | `#FDF4F7` | `#F9F5FA` | `#F9F5F9` |
| 100 | `#E0F0F8` | `#DAF2F6` | `#FAE6F7` | `#F4E8FC` | `#F9E7ED` | `#F1EAF3` | `#EFEBEF` |
| 200 | `#C3E0EE` | `#B8E4EA` | `#F1CEEE` | `#E7D1F5` | **`#F3D3DE`** | `#E3D5E6` | `#DFD8DF` |
| 300 | `#9FCCE2` | `#8AD2DC` | `#E5B0E1` | `#D6B5EB` | `#E5B5C6` | **`#D0BBD5`** | `#C9C1C8` |
| 400 | `#76B1CD` | `#56B8C5` | `#D08DCB` | `#BE94D8` | `#CF94AA` | `#B79DBE` | `#ACA5AB` |
| 500 | `#5294B2` | **`#0394A2`** | `#B46DB0` | **`#9F71BA`** | `#B4758D` | `#9B7FA2` | `#90878F` |
| 600 | `#377A98` | `#02818D` | `#995395` | `#895BA3` | `#995C74` | `#826688` | `#776E76` |
| 700 | `#20617C` | `#04666F` | `#7D3D7A` | `#6E4586` | `#7D455C` | `#684F6E` | `#5F565E` |
| 800 | **`#134D64`** | `#044D55` | `#622B5F` | `#55316A` | `#613245` | `#503B55` | `#494148` |
| 900 | `#013649` | `#02383D` | **`#4E1F4C`** | `#3F2050` | `#492132` | `#3B293F` | `#352E34` |
| 950 | `#002230` | `#002328` | `#300D2F` | `#291236` | `#30131F` | `#261829` | `#221B22` |

**Generation rule** (implemented in `theme/build-theme.ts` with `culori`, so any new seed produces a matching scale):

- Hue is fixed to the seed's OKLCH hue.
- Lightness per step, 50 → 950: 0.975, 0.945, 0.89, 0.82, 0.73, 0.635, 0.55, 0.465, 0.385, 0.31, 0.235.
- Chroma per step = seed chroma × curve(step) ÷ curve(anchor step), with curve 0.12, 0.25, 0.45, 0.70, 0.90, 1.00, 1.00, 0.95, 0.85, 0.75, 0.60; reduced until the colour fits sRGB.
- The seed replaces the generated value at its anchor step: teal 800, lagoon 500, plum 900, orchid 500, blush 200, lilac 300.
- Neutral uses plum's hue with chroma 0.006 (50–100), 0.012 (200–400), 0.016 (500–950); step 0 is the cream canvas.
- The table above is the expected output for the default seeds; a unit test asserts it.

#### Semantic tokens

Components use these names only (via Tailwind classes such as `bg-canvas`, `text-fg-muted`, `border-input`). Every text pair below was contrast-checked against WCAG 2.2.

**Default theme (light sections)**

| Token | Maps to | Use | Contrast |
| --- | --- | --- | --- |
| `bg-canvas` | neutral-0 `#FDFDF8` | Page background | — |
| `bg-subtle` | blush-50 `#FDF4F7` | Alternating sections | — |
| `bg-muted` | lilac-100 `#F1EAF3` | Cards, input fills, glossary panels | — |
| `bg-highlight` | blush-200 `#F3D3DE` | Eyebrow pills, tags, announcement label (the flyer's pill) | teal-800 text 6.68:1 |
| `fg-default` | neutral-950 `#221B22` | Body text | 16.49:1 on canvas |
| `fg-heading` | teal-800 `#134D64` | Headings, wordmark-style display text | 9.05:1 |
| `fg-muted` | neutral-700 `#5F565E` | Secondary text, standfirsts | 6.91:1 |
| `fg-subtle` | neutral-600 `#776E76` | Meta, captions, dates only | 4.81:1 |
| `fg-link` / hover | teal-700 `#20617C` / teal-800 | Inline links (always underlined) | 6.72:1 |
| `border-default` | neutral-200 `#DFD8DF` | Dividers, card outlines (decorative) | — |
| `border-input` | neutral-500 `#90878F` | Form field borders | 3.40:1 (≥ 3:1 UI) |
| `focus-ring` | orchid-500 `#9F71BA` | 2px ring + 2px offset on every focusable | 3.71:1 |
| `action-primary-bg` / `-fg` | teal-800 / `#FFFFFF`; hover teal-900 `#013649` | Solid buttons, nav CTA pill | 9.24:1 |
| `action-secondary` | transparent, teal-800 border and text | Outline buttons | 9.05:1 |
| `action-accent-bg` / `-fg` | lagoon-700 `#04666F` / `#FFFFFF` | Event RSVP, "Share your story" | 6.70:1 |
| `accent-lagoon` | lagoon-500 `#0394A2` | Icons, wave graphics, chart lines (never text) | 3.57:1 |
| `accent-orchid` | orchid-500 `#9F71BA` | Dots, bullets, active indicators (never text) | 3.71:1 |
| `accent-orchid-text` | orchid-700 `#6E4586` | Orchid-coloured text (Connect pillar) | 7.20:1 |
| `accent-lagoon-text` | lagoon-700 `#04666F` | Lagoon-coloured text (Act pillar) | 6.56:1 |

**Inverse theme (plum sections, footer, dark hero text)** — applied with `data-theme="inverse"`

| Token | Maps to | Contrast |
| --- | --- | --- |
| `bg-canvas` | plum-900 `#4E1F4C` | — |
| `bg-deep` | plum-950 `#300D2F` | — |
| `fg-default` / `fg-heading` | cream `#FDFDF8` | 12.67:1 on plum-900, 16.81:1 on plum-950 |
| `fg-muted` | blush-200 `#F3D3DE` | 9.35:1 |
| `accent-lagoon` | lagoon-300 `#8AD2DC` | 7.59:1 (text-safe) |
| `accent-orchid` | orchid-300 `#D6B5EB` | 7.18:1 (text-safe) |
| `action-primary-bg` / `-fg` | cream / plum-900 | 12.67:1 |
| `action-secondary` | transparent, cream border and text | 12.67:1 |

**Brand theme (teal bands, e.g. newsletter, stats)** — `data-theme="brand"`: background teal-800, text white (9.24:1), primary button lagoon-300 with plum-950 text (10.07:1).

**Status colours** (same OKLCH method, tuned to sit beside the palette)

| Status | Text | Soft background | Solid (white text) |
| --- | --- | --- | --- |
| Success | `#016D3C` (6.33:1) | `#E3F8E9` | `#00884D` (4.54:1) |
| Warning | `#7E4F04` (6.84:1) | `#FFEFDE` | `#9D6304` (4.98:1) |
| Error | `#92393E` (7.15:1) | `#FEEDED` | `#B5494E` (5.21:1) |
| Info | `#026484` (6.52:1) | `#E2F5FF` | `#027DA3` (4.70:1) |

#### Usage rules

- **Proportion ≈ 60 / 30 / 10**: cream, blush and lilac surfaces 60%; teal ink and plum sections 30%; lagoon and orchid accents 10%.
- **Lagoon-500 and orchid-500 never carry text or white-text buttons** (white on them is only 3.64:1 and 3.79:1). Use their 700 steps for text and buttons.
- **Hero overlay** is a plum-950 gradient (0 → 80%, direction from the `hero.overlayDirection` field) instead of black, so photography reads on-brand; hero text uses the inverse theme.
- **Pillar colours**: Learn = teal, Connect = orchid, Act = lagoon. Used on pillar cards, mission-statement highlights, category chips and section eyebrows.
- **Brand waves**: the flyer's flowing shapes become a `<BrandWaves />` SVG component (plum-900, lilac-300, blush-200, lagoon-500 layers) used on hero corners, the newsletter band and the 404 page. In motion it drifts slowly (subtle) and is static under reduced motion.
- **Block backgrounds**: the CMS `background` field on blocks maps to themes: light → default, dark → inverse, brand → brand.
- Only pairs listed above may carry text; new pairs must be added to the contrast test.

#### Configuration in code

```
/theme
  theme.config.ts       the only file to edit: seeds, anchors, ladders, semantic map, fonts
  build-theme.ts        generates scales + CSS variables (runs on predev and prebuild)
  contrast.test.ts      Vitest: fails CI if any listed text pair drops below AA
  scales.test.ts        asserts default seeds reproduce the scale table
/app/theme.generated.css  output, committed, never hand-edited
```

```ts
// theme/theme.config.ts — single source of truth for colour and type
const env = (key: string, fallback: string) => process.env[key]?.trim() || fallback

export const themeConfig = {
  seeds: {
    teal:   { hex: env('NEXT_PUBLIC_THEME_TEAL',   '#134D64'), anchor: 800 }, // wordmark ink
    plum:   { hex: env('NEXT_PUBLIC_THEME_PLUM',   '#4E1F4C'), anchor: 900 }, // dark waves
    lagoon: { hex: env('NEXT_PUBLIC_THEME_LAGOON', '#0394A2'), anchor: 500 }, // bright wave
    orchid: { hex: env('NEXT_PUBLIC_THEME_ORCHID', '#9F71BA'), anchor: 500 }, // dot over the y
    blush:  { hex: env('NEXT_PUBLIC_THEME_BLUSH',  '#F3D3DE'), anchor: 200 }, // pill
    lilac:  { hex: env('NEXT_PUBLIC_THEME_LILAC',  '#D0BBD5'), anchor: 300 }, // mist wave
  },
  neutral: {
    hueFrom: 'plum',
    chroma: { 50: 0.006, 100: 0.006, 200: 0.012, 300: 0.012, 400: 0.012, rest: 0.016 },
    canvas: env('NEXT_PUBLIC_THEME_CANVAS', '#FDFDF8'),
  },
  lightness: { 50: 0.975, 100: 0.945, 200: 0.89, 300: 0.82, 400: 0.73, 500: 0.635,
               600: 0.55, 700: 0.465, 800: 0.385, 900: 0.31, 950: 0.235 },
  chromaCurve: { 50: 0.12, 100: 0.25, 200: 0.45, 300: 0.7, 400: 0.9, 500: 1,
                 600: 1, 700: 0.95, 800: 0.85, 900: 0.75, 950: 0.6 },
  themes: {
    default: {
      'bg-canvas': 'neutral-0', 'bg-subtle': 'blush-50', 'bg-muted': 'lilac-100',
      'bg-highlight': 'blush-200', 'fg-default': 'neutral-950', 'fg-heading': 'teal-800',
      'fg-muted': 'neutral-700', 'fg-subtle': 'neutral-600', 'fg-link': 'teal-700',
      'fg-link-hover': 'teal-800', 'border-default': 'neutral-200', 'border-input': 'neutral-500',
      'focus-ring': 'orchid-500', 'action-primary-bg': 'teal-800', 'action-primary-bg-hover': 'teal-900',
      'action-primary-fg': '#FFFFFF', 'action-accent-bg': 'lagoon-700', 'action-accent-fg': '#FFFFFF',
      'accent-lagoon': 'lagoon-500', 'accent-orchid': 'orchid-500',
      'accent-lagoon-text': 'lagoon-700', 'accent-orchid-text': 'orchid-700',
    },
    inverse: {
      'bg-canvas': 'plum-900', 'bg-deep': 'plum-950', 'fg-default': 'neutral-0',
      'fg-heading': 'neutral-0', 'fg-muted': 'blush-200', 'accent-lagoon': 'lagoon-300',
      'accent-orchid': 'orchid-300', 'action-primary-bg': 'neutral-0', 'action-primary-fg': 'plum-900',
    },
    brand: {
      'bg-canvas': 'teal-800', 'fg-default': '#FFFFFF', 'fg-heading': '#FFFFFF',
      'action-primary-bg': 'lagoon-300', 'action-primary-fg': 'plum-950',
    },
  },
  status: {
    success: { text: '#016D3C', bg: '#E3F8E9', solid: '#00884D' },
    warning: { text: '#7E4F04', bg: '#FFEFDE', solid: '#9D6304' },
    error:   { text: '#92393E', bg: '#FEEDED', solid: '#B5494E' },
    info:    { text: '#026484', bg: '#E2F5FF', solid: '#027DA3' },
  },
  pillars: { learn: 'teal', connect: 'orchid', act: 'lagoon' },
  overlay: { color: 'plum-950', maxOpacity: 0.8 },
  fonts: {
    display: { family: env('NEXT_PUBLIC_FONT_DISPLAY', 'Bricolage Grotesque'), source: 'google', weights: [500, 700] },
    body:    { family: env('NEXT_PUBLIC_FONT_BODY', 'Figtree'), source: 'google', weights: [400, 500, 600] },
  },
} as const
```

```bash
# .env.local — optional, build-time only. Blank = use theme.config.ts defaults.
# Changing these needs a rebuild/redeploy (NEXT_PUBLIC_ vars are inlined at build).
NEXT_PUBLIC_THEME_TEAL=
NEXT_PUBLIC_THEME_PLUM=
NEXT_PUBLIC_THEME_LAGOON=
NEXT_PUBLIC_THEME_ORCHID=
NEXT_PUBLIC_THEME_BLUSH=
NEXT_PUBLIC_THEME_LILAC=
NEXT_PUBLIC_THEME_CANVAS=
NEXT_PUBLIC_FONT_DISPLAY=
NEXT_PUBLIC_FONT_BODY=
```

```css
/* app/theme.generated.css — excerpt of what build-theme.ts writes */
:root {
  --teal-50: #F0F8FC; /* … every step of every scale … */ --teal-800: #134D64;
  --color-bg-canvas: var(--neutral-0);
  --color-fg-default: var(--neutral-950);
  --color-action-primary-bg: var(--teal-800);
  /* … all default-theme tokens … */
}
[data-theme='inverse'] { --color-bg-canvas: var(--plum-900); --color-fg-default: var(--neutral-0); /* … */ }
[data-theme='brand']   { --color-bg-canvas: var(--teal-800); --color-fg-default: #FFFFFF; /* … */ }

/* app/globals.css — Tailwind v4 maps tokens to utilities */
@import 'tailwindcss';
@import './theme.generated.css';
@theme inline {
  --color-canvas: var(--color-bg-canvas);
  --color-fg: var(--color-fg-default);
  --color-fg-muted: var(--color-fg-muted);
  --color-primary: var(--color-action-primary-bg);
  /* … one line per semantic token, plus raw scales for decorative use … */
}
```

**Rules for the build:**

1. `build-theme.ts` runs on `predev` and `prebuild` (`tsx theme/build-theme.ts`), reads the config (with env overrides applied), and writes `theme.generated.css`.
2. The contrast test runs on the generated values, so an override that breaks AA fails CI before deploy.
3. Components use semantic classes only (`bg-canvas`, `text-fg-muted`, `bg-primary`); raw scale classes (`bg-plum-900`) are allowed only in decorative components such as `<BrandWaves />`.
4. Dark mode by OS preference is out of scope at launch; the inverse theme already covers dark sections and can become a site-wide dark mode later by toggling `data-theme` on `<html>`.

**Fonts (not from the flyer):** proposed pairing is Bricolage Grotesque for display (warm, slightly expressive, close to the Radiating Hope headline feel) and Figtree for body (friendly, very legible at small sizes). Both load through `next/font/google`, and either can be swapped in `theme.config.ts` or `.env`. Confirm in Phase 0.

### Core components

Announcement bar · Floating pill nav with mega menu · Mobile full-screen menu · Button (solid, outline, ghost, on-dark) · Eyebrow label · Card (article, event, story, expert, pillar) · Tabs · Accordion · Modal / slide-in · Form fields with inline errors · Toast · Badge/tag · Pagination · Breadcrumbs · Video player with captions and pause · Stat counter · Quote · Footer.

### Motion principles

1. **Motion explains, never decorates for its own sake.** Each animation shows hierarchy, continuity or feedback.
2. **Two intensities.** *Subtle* (default): 8–24px translate + fade, 300–600ms, stagger 60ms. *Exaggerated* (reserved): large scale, mask, split-text or scroll-pinned sequences, 800–1600ms.
3. **Respect `prefers-reduced-motion`.** All motion components read a global `useReducedMotion` flag: transforms are removed, opacity fades kept at ≤200ms, Lenis disabled, hero video paused on a poster.
4. **Performance budget.** Animate only `transform` and `opacity`; no layout thrash; GSAP loaded only on routes that need it (dynamic import).
5. **CMS control.** Each page-builder block has an `animation` field: `none`, `subtle` (default), `exaggerated` (only offered on blocks that support it).

### Subtle motion (everywhere)

| Where | Animation | Library |
| --- | --- | --- |
| Section entry | Fade + rise 16px, children staggered | Motion `whileInView` |
| Cards | Lift 4px + image zoom 1.04 on hover; focus ring animates in | Motion / CSS |
| Buttons | Arrow icon slides 4px; fill wipe on hover | CSS |
| Nav | Glass pill shrinks and darkens after 80px scroll; mega menu fades/slides 8px; active indicator glides between items | Motion `layoutId` |
| Announcement bar | Collapses on dismiss with height animation | Motion `AnimatePresence` |
| Tabs (events, learn categories) | Content cross-fade, underline glides | Motion `layoutId` |
| Accordion (FAQ, glossary) | Height + chevron rotate | Motion |
| Forms | Field error shake (3px), success tick draw-on | Motion |
| Page transitions | 200ms cross-fade between routes | Motion + View Transitions API where supported |
| Smooth scroll | Lenis with light inertia | Lenis |

### Exaggerated moments (five, deliberate)

| # | Moment | What happens | Library |
| --- | --- | --- | --- |
| 1 | Homepage hero | Headline splits by line and word, rising from a mask (RH-style 3-line headline); media scales from 1.15 to 1.0; CTAs pop in last. On scroll, hero media parallaxes and the overlay darkens | GSAP SplitText + ScrollTrigger |
| 2 | Mission statement | The long mission paragraph reveals word by word as the reader scrolls (muted → full colour), with the words Learn, Connect, Act highlighted in their pillar colours (Learn teal, Connect orchid, Act lagoon) | GSAP ScrollTrigger scrub |
| 3 | Learn / Connect / Act pillars | Section pins; three pillar cards fan in and stack as the user scrolls, each changing the background tint | GSAP ScrollTrigger pin |
| 4 | Impact stats | Numbers count up; a circular or bar graphic draws on | Motion `animate` + SVG pathLength |
| 5 | Stories carousel | Draggable carousel with momentum; active story card scales up, quote marks animate, image reveals with clip-path | Motion drag + Embla Carousel |

Also exaggerated but small: the **story-submitted success screen** (confetti-free, a blooming brand shape drawing in) and the **404 page** (a playful animated illustration).

## 5. Information architecture

Navigation follows the mission: **Learn**, **Connect**, **Act**, plus About; every route maps to one Sanity document type or singleton.

### Routes

| Route | Page | Source in Sanity | Phase |
| --- | --- | --- | --- |
| / | Home | `homePage` singleton (page builder) | 2 |
| /about | About / Mission + Founding Circle | `aboutPage` singleton + `teamMember` docs | 2 |
| /learn | Learn hub (featured, categories, latest, search) | `learnHubPage` singleton + `article` docs | 2 |
| /learn/\[category\] | Category listing | `category` doc | 2 |
| /learn/\[category\]/\[slug\] | Article (explainer, myth-buster, doctor-question guide) | `article` doc | 2 |
| /learn/glossary | Glossary A–Z with search | `glossaryTerm` docs | 4 |
| /learn/glossary/\[slug\] | Single term (for SEO and deep links) | `glossaryTerm` doc | 4 |
| /connect/stories | Community stories listing | `story` docs (status = approved) | 4 |
| /connect/stories/\[slug\] | Single story | `story` doc | 4 |
| /connect/share-your-story | Story submission form | `shareStoryPage` singleton | 4 |
| /connect/events | Upcoming events + calendar view, past archive | `event` docs | 4 |
| /connect/events/\[slug\] | Event detail, RSVP, add-to-calendar | `event` doc | 4 |
| /connect/guidelines | Community guidelines | `page` doc (slug fixed) | 2 |
| /contact | Contact form + details | `contactPage` singleton + `siteSettings` | 3 |
| /newsletter | Newsletter landing (for links from socials) | `page` doc with newsletter block | 3 |
| /act/experts | Expert directory with filters | `expert` docs | 6 |
| /act/volunteer | Volunteer / partner signup | `page` doc + form block | 6 |
| /act/donate | Donation page | `donatePage` singleton | 6 |
| /privacy, /terms, /medical-disclaimer, /accessibility | Legal pages | `page` docs | 2 |
| /\[slug\] | Any other page editors create | `page` doc (page builder) | 2 |
| /studio | Sanity Studio | — | 1 |

### Navigation (editable in Sanity)

- **Announcement bar**: optional, one message at a time.
- **Primary nav (floating pill)**: About ▾ (Our mission, Founding Circle, Community guidelines) · Learn ▾ (Learn hub, Myth-busters, Questions for your doctor, Glossary) · Connect ▾ (Stories, Share your story, Events) · Act ▾ (Phase 6: Volunteer, Partner with us, Donate, Find an expert). Each item: title + one-line description, like Radiating Hope.
- **Right side**: text link "Get support" (to a page of help resources) + pill button "Join the newsletter" (opens the newsletter slide-in).
- **Mobile**: hamburger opens a full-screen menu with accordion groups and the CTA pinned to the bottom.
- **Footer**: logo + short mission line; 4 link columns; newsletter form; address, email, phone; social icons; legal row; medical disclaimer line; copyright with auto year; "Site by Yenko Studio".

### Homepage section order (default; editors can reorder)

1. Announcement bar
2. Hero: full-bleed video/image, 3-line headline, subline, "Explore the Learn hub" + "Share your story" CTAs (exaggerated moment 1)
3. Mission statement with Learn / Connect / Act highlights (moment 2)
4. Pillars: Learn, Connect, Act cards (moment 3)
5. Impact stats band (moment 4)
6. Problem → solution split block (IWH style): "The problem" / "What we're doing about it"
7. Featured Learn articles (3 cards, type label + "Read article")
8. Upcoming events with type tabs + "See all events"
9. Community stories carousel (moment 5) + "Share your story" CTA
10. Testimonial / pull-quote
11. Newsletter band
12. Closing CTA with image ("Ready to take action?")
13. Footer

### Page templates

- **Article**: breadcrumb, category + type label, title, standfirst, author and medical reviewer, last reviewed date, reading time, hero image, sticky table of contents (desktop), rich body with callouts, myth/fact cards, "questions to ask your doctor" checklist (printable), glossary term tooltips, sources list, disclaimer, related articles, newsletter CTA.
- **Event**: hero image, date/time with timezone, type badge, format (online/in-person), location map link or join link (revealed after RSVP), host/speakers, description, RSVP form with capacity left, add-to-calendar (Google, Outlook, Apple .ics), share buttons. Past events show recording link if provided.
- **Story**: title, author display name or "Anonymous", optional age range and country, pull quote, body, content warning (optional, collapsible), related stories, "Share your story" CTA.
- **Glossary**: A–Z jump bar, live filter, accordion entries with plain-language definition, "also known as", related terms and articles.
- **Generic page**: hero (optional) + page builder blocks.

## 6. Sanity CMS schemas

The model has 10 singletons, 14 document types, 12 reusable objects and 18 page-builder blocks; anything that appears on the site, including hero media, socials, address and footer, lives in one of them.

### Type inventory

| Kind | Types |
| --- | --- |
| Singletons | `siteSettings`, `navigation`, `footer`, `announcementBar`, `homePage`, `aboutPage`, `learnHubPage`, `shareStoryPage`, `contactPage`, `donatePage` (Phase 6) |
| Documents | `page`, `article`, `category`, `author`, `glossaryTerm`, `event`, `eventRsvp`, `story`, `teamMember`, `testimonial`, `contactSubmission`, `expert` (6), `specialty` (6), `volunteerApplication` (6) |
| Objects | `seo`, `link`, `cta`, `heroMedia`, `hero`, `richText`, `socialLink`, `address`, `navGroup`, `navItem`, `stat`, `faqItem` |
| Blocks | `heroBlock`, `missionStatementBlock`, `pillarsBlock`, `statsBlock`, `problemSolutionBlock`, `featuredArticlesBlock`, `upcomingEventsBlock`, `storiesCarouselBlock`, `testimonialBlock`, `newsletterBlock`, `ctaBlock`, `richTextBlock`, `imageTextBlock`, `mediaBlock`, `faqBlock`, `teamGridBlock`, `formBlock`, `logoCloudBlock` |

Conventions for every type: `defineType`/`defineField`, descriptions on every field for editors, validation messages in plain English, `preview` configured, icons from `@sanity/icons`, and an `animation` field (`none` / `subtle` / `exaggerated`) on every block.

### Singletons

**siteSettings** — global identity, contact and socials

| Field | Type | Rules / notes |
| --- | --- | --- |
| siteName | string | Required. "Cysters In Action" |
| tagline | string | Max 120 chars |
| logo / logoOnDark / favicon | image (SVG/PNG) | Logo required; favicon 512×512 |
| contactEmail, mediaEmail, partnershipsEmail | email | contactEmail required; others optional |
| phone | string | E.164 format validated |
| whatsapp | string | Optional click-to-chat number |
| address | `address` | Shown in footer and contact page |
| socialLinks | array of `socialLink` | Instagram, TikTok, X, Facebook, LinkedIn, YouTube, Threads, WhatsApp channel |
| defaultSeo | `seo` | Fallback title template "%s · Cysters In Action", OG image |
| medicalDisclaimer | `richText` (short) | Shown on Learn pages and footer |
| emailProvider | object { provider: brevo/mailchimp/none, listId } | Read-only for editors (developer role) |
| analyticsId | string | Developer role only |

**navigation** — `mainNav` array of `navGroup` (label, optional link, items\[\] of `navItem`: title, description, link, icon); `secondaryLink` (`link`, e.g. "Get support"); `primaryCta` (`cta`, e.g. "Join the newsletter" with action = open newsletter modal or link).

**footer** — `blurb` (text), `columns` (array of { heading, links\[\] of `link` }, max 4), `showNewsletter` (boolean), `newsletterHeading`, `legalLinks` (array of `link`), `copyrightText` (string, `{year}` token replaced at render), `credit` (`link`, "Site by Yenko Studio"). Address, contact and socials come from siteSettings so they are entered once.

**announcementBar** — `enabled` (boolean), `label` (string, e.g. "NEW"), `message` (string, max 140), `link` (`link`), `startDate` / `endDate` (datetime), `dismissible` (boolean), `tone` (brand/neutral/alert). Hidden automatically outside the date window.

**homePage** — `seo`, `hero` (`hero`), `sections` (array of any page-builder block). Seeded with the default homepage order from Section 5.

**aboutPage** — `seo`, `hero`, `story` (`richText`), `pillars` (exactly 3: title, icon, body — Learn, Connect, Act), `values` (array {title, body}), `foundingCircleHeading`, `foundingCircle` (array of references to `teamMember`, orderable), `sections` (page builder).

**learnHubPage** — `seo`, `hero`, `featuredArticles` (references to `article`, max 3), `introText`, `showGlossaryTeaser` (boolean), `doctorGuidesHeading`, `sections`.

**shareStoryPage** — `seo`, `hero`, `intro` (`richText`), `whatHappensNext` (array of steps {title, body}), `consentText` (`richText`, required), `privacyNote`, `successHeading`, `successMessage`, `submissionsOpen` (boolean; when false shows `closedMessage`).

**contactPage** — `seo`, `hero`, `intro`, `enquiryTypes` (array {label, value, routeToEmail}) e.g. Partnership, Media, General; `successMessage`; `showMap` (boolean), `mapEmbedUrl` (url).

**donatePage** (Phase 6) — `seo`, `hero`, `impactTiers` (array {amount, currency, description}), `provider` (paystack/stripe/external), `externalUrl`, `currencyOptions`, `thankYouMessage`, `transparencyText`.

### Shared objects

| Object | Fields |
| --- | --- |
| `seo` | metaTitle (max 60), metaDescription (max 160), ogImage (1200×630), noIndex (boolean), canonicalUrl |
| `link` | label, type (internal/external/email/phone/anchor), internal (reference to any routable doc), external (url, http/https/mailto/tel), openInNewTab |
| `cta` | `link` + style (solid/outline/ghost) + action (navigate / openNewsletter / scrollTo) |
| `heroMedia` | mediaType (image/video), image (with hotspot + required alt), videoFile (mp4), videoWebm (optional), poster (image, required for video), captionsFile (.vtt), loop, autoplayMuted (boolean, default true) |
| `hero` | eyebrow, headline (string; line breaks with Shift+Enter become separate animated lines), subline, `heroMedia`, overlayStrength (0–80%, default 50), overlayDirection (left/bottom/full), ctas (array of `cta`, max 2), height (full/large/medium), textAlign |
| `richText` | Portable Text: normal, h2–h4, blockquote; bold, italic, link, glossary-term annotation (reference); custom blocks: image with caption, callout (info/warning/tip), mythFact {myth, fact, source}, doctorQuestions {title, questions\[\]}, video embed, button |
| `socialLink` | platform (list), url, handle |
| `address` | organisationName, line1, line2, city, region, postalCode, country, digitalAddress (e.g. Ghana Post GPS, optional), mapUrl |
| `navGroup` / `navItem` | as described under navigation |
| `stat` | value (number), prefix, suffix (e.g. "+", "%"), label, source |
| `faqItem` | question, answer (`richText`) |

### Document types

**page** — title, slug (unique), `seo`, `hero` (optional), `sections` (page builder), parent (reference to page, for breadcrumbs).

**article** (Learn hub)

| Field | Type | Rules / notes |
| --- | --- | --- |
| title | string | Required, max 90 |
| slug | slug | From title, unique within category |
| articleType | list: explainer / mythBuster / doctorGuide / personalInsight / news | Drives the card label and template variant |
| category | reference → `category` | Required |
| tags | array of strings | Free tags for filtering |
| standfirst | text | Max 220; used as card excerpt |
| mainImage | image + alt (required) + caption + credit | Hotspot on |
| body | `richText` | Required |
| myths | array of { myth, fact, sourceUrl } | Shown only when articleType = mythBuster |
| doctorQuestions | array of { question, whyItMatters } | Shown when articleType = doctorGuide; printable/downloadable checklist |
| author | reference → `author` | Required |
| medicalReviewer | reference → `author` (role = medical reviewer) | Recommended; warning (not error) if empty |
| publishedAt / lastReviewedAt | datetime | lastReviewedAt shows a "Review due" badge in Studio after 12 months |
| readingTime | number | Computed at query time from body word count |
| sources | array of { title, url, publisher, year } |  |
| relatedArticles | references → `article`, max 3 | Fallback: same category |
| glossaryTerms | references → `glossaryTerm` | Highlights terms in body |
| featured | boolean |  |
| contentWarning | string | Optional |
| seo | `seo` |  |

**category** — title, slug, description, icon, colour (from brand palette list), order.

**author** — name, slug, role (writer / medicalReviewer / communityMember), credentials (e.g. "MD, Gynaecologist"), bio, photo, socialLinks.

**glossaryTerm** — term (required, unique), slug, alsoKnownAs (array), pronunciation (optional), shortDefinition (max 200, used in tooltips), fullExplanation (`richText`), relatedTerms (references), relatedArticles (references), letter (auto from term, for A–Z).

**event**

| Field | Type | Rules / notes |
| --- | --- | --- |
| title, slug | string, slug | Required |
| eventType | list: webinar / meetup / qna / workshop / other | Drives tabs and badge |
| format | list: online / inPerson / hybrid |  |
| startDateTime / endDateTime | datetime | Required; end must be after start |
| timezone | string (IANA list, default Africa/Accra) | Shown with time; .ics uses it |
| summary | text, max 200 | Card text |
| description | `richText` |  |
| image | image + alt |  |
| venue | { name, `address`, mapUrl } | Hidden unless format includes inPerson |
| onlineJoinUrl | url | Never rendered publicly; emailed to RSVPs |
| hosts | references → `author` / `teamMember` |  |
| rsvpEnabled | boolean |  |
| rsvpMode | list: internal / external | internal = our form; external = Eventbrite/Luma/Zoom URL |
| externalRsvpUrl | url | Required when rsvpMode = external |
| capacity | number | Optional; form closes at capacity, shows waitlist |
| rsvpDeadline | datetime |  |
| recordingUrl | url | Shown on past event |
| status | list: scheduled / cancelled / postponed | Banner on page |
| seo | `seo` |  |

**eventRsvp** (created by the site, read-only in Studio) — event (reference), name, email, attendance (attending / maybe), questions (text), consentNewsletter (boolean), createdAt, emailConfirmed (boolean).

**story** (community submissions)

| Field | Type | Rules / notes |
| --- | --- | --- |
| status | list: submitted / inReview / changesRequested / approved / rejected / withdrawn | Only `approved` is queried publicly; default `submitted` |
| title | string | Editable by moderators |
| slug | slug | Generated on approval |
| isAnonymous | boolean | When true, the site never renders authorName or photo |
| authorName | string | Display name |
| contactEmail | email | Private: hidden from public queries, field-level read restricted to moderators |
| ageRange | list | Optional |
| country | string | Optional |
| body | `richText` (plain from form, editable) |  |
| pullQuote | string | Chosen by moderator for cards/carousel |
| image | image + alt | Optional; only if submitter consented |
| themes | array (diagnosis, fertility, mental health, nutrition, work, relationships...) | Filter chips on listing |
| contentWarning | string |  |
| consentPublish / consentEdit / consentContact | boolean | Captured from form, read-only |
| moderationNotes | text | Internal only |
| submittedAt / approvedAt | datetime |  |
| featured | boolean | Homepage carousel |

**teamMember** (Founding Circle) — name, role, group (foundingCircle / advisor / volunteer), photo + alt, bio, quote, socialLinks, order.

**testimonial** — quote, attribution, role/context, image (optional), featured.

**contactSubmission** (created by site) — enquiryType, name, email, organisation, message, createdAt, status (new / replied / closed). Optional: if the client prefers inbox-only, we skip storing and only email.

**expert** (Phase 6) — name, slug, title (Dr./etc.), specialties (references → `specialty`), credentials, bio, photo, clinicName, `address`, city, country, telehealth (boolean), languages, contactUrl, phone, email, verified (boolean, set by admin), verifiedAt, recommendedBy (text, internal). Public listing filters by specialty, country/city and telehealth.

**specialty** (Phase 6) — title (Gynaecologist, Endocrinologist, Dietitian, Mental health, Dermatologist, Fertility specialist), slug, description.

**volunteerApplication** (Phase 6, created by site) — type (volunteer / partnerOrganisation), name, email, phone, organisation, website, skills (array), availability, message, consent, status (new / contacted / accepted / declined).

### Page-builder blocks

| Block | Key fields | Animation |
| --- | --- | --- |
| `heroBlock` | `hero` object | subtle / exaggerated |
| `missionStatementBlock` | eyebrow, statement (text), highlightWords (array of { word, colour }), cta | subtle / exaggerated (word reveal) |
| `pillarsBlock` | heading, pillars (array of { title, body, icon, image, link }, 3–4) | subtle / exaggerated (pinned stack) |
| `statsBlock` | heading, stats (array of `stat`, 2–4), background (brand/dark/light) | subtle / exaggerated (count-up) |
| `problemSolutionBlock` | problemEyebrow, problemHeading, problemBody, solutionEyebrow, solutionHeading, solutionBody, image | subtle |
| `featuredArticlesBlock` | heading, mode (latest / featured / manual / byCategory), articles (refs), category (ref), limit, cta | subtle |
| `upcomingEventsBlock` | heading, showTabs (boolean), eventTypes filter, limit, cta | subtle |
| `storiesCarouselBlock` | heading, mode (featured / latest / manual), stories (refs), cta | subtle / exaggerated |
| `testimonialBlock` | testimonials (refs), layout (single / slider) | subtle |
| `newsletterBlock` | heading, body, buttonLabel, successMessage, variant (band / card) | subtle |
| `ctaBlock` | heading, body, image, ctas (max 2), background | subtle |
| `richTextBlock` | content (`richText`), width (narrow / wide) | none / subtle |
| `imageTextBlock` | heading, body, image, imagePosition (left/right), cta | subtle |
| `mediaBlock` | `heroMedia`, caption, fullBleed | subtle |
| `faqBlock` | heading, items (array of `faqItem`) — also emits FAQ structured data | subtle |
| `teamGridBlock` | heading, group filter or manual refs | subtle |
| `formBlock` | formType (contact / volunteer / partner / newsletter), heading, intro | none |
| `logoCloudBlock` | heading, logos (image + alt + url) for partners | subtle (marquee) |

### Studio structure (desk)

1. **Site** — Settings, Navigation, Footer, Announcement bar (singletons, no "create new")
2. **Pages** — Home, About, Learn hub, Share your story, Contact, Donate (6), then all other Pages
3. **Learn** — Articles (filtered views: by type, "Review due", drafts), Categories, Authors, Glossary
4. **Connect** — Events (Upcoming / Past), RSVPs by event, Testimonials
5. **Stories inbox** — New submissions (badge count), In review, Approved, Rejected; custom document actions **Approve & publish**, **Request changes**, **Reject**
6. **Inbox** — Contact submissions, Volunteer/partner applications (6)
7. **People** — Founding Circle / Team, Experts (6), Specialties (6)

Studio plugins: Presentation (visual editing), Media browser, `@sanity/orderable-document-list` (team, categories), `@sanity/document-internationalization` (installed later if needed), Vision (developers only).

### Roles and permissions

| Role | Can do |
| --- | --- |
| Administrator (Yenko + client lead) | Everything, incl. settings, datasets, API tokens |
| Editor (content team) | Create/edit/publish pages, articles, events, glossary, team |
| Moderator (community lead) | Stories inbox, testimonials, read RSVPs and submissions |
| Contributor (writers, if plan allows custom roles) | Create drafts of articles only; cannot publish |

Personal data (story contact emails, RSVPs, submissions) is excluded from the public read token by keeping it in a **private dataset or using a GROQ filter on a token with restricted access**; public queries use a CDN client that never selects those fields.

### Example schema (story)

```ts
export const story = defineType({
  name: 'story', title: 'Community story', type: 'document',
  groups: [{name: 'content', default: true}, {name: 'moderation'}, {name: 'private'}],
  fields: [
    defineField({name: 'status', type: 'string', group: 'moderation', initialValue: 'submitted',
      options: {list: ['submitted','inReview','changesRequested','approved','rejected','withdrawn'], layout: 'radio'},
      validation: (r) => r.required()}),
    defineField({name: 'title', type: 'string', group: 'content', validation: (r) => r.required().max(90)}),
    defineField({name: 'slug', type: 'slug', group: 'content', options: {source: 'title'},
      hidden: ({document}) => document?.status !== 'approved'}),
    defineField({name: 'isAnonymous', type: 'boolean', group: 'content', initialValue: false}),
    defineField({name: 'authorName', type: 'string', group: 'content', hidden: ({document}) => !!document?.isAnonymous}),
    defineField({name: 'contactEmail', type: 'email', group: 'private', readOnly: true}),
    defineField({name: 'body', type: 'richText', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'pullQuote', type: 'string', group: 'content', validation: (r) => r.max(160)}),
    defineField({name: 'themes', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}}),
    defineField({name: 'consentPublish', type: 'boolean', group: 'private', readOnly: true}),
    defineField({name: 'moderationNotes', type: 'text', group: 'moderation'}),
    defineField({name: 'featured', type: 'boolean', group: 'moderation'}),
  ],
  preview: {select: {title: 'title', status: 'status', anon: 'isAnonymous', name: 'authorName'},
    prepare: ({title, status, anon, name}) => ({title, subtitle: `${status} · ${anon ? 'Anonymous' : name}`})},
})
```

## 7. Forms and integrations

All forms run through Next.js Server Actions with one shared pipeline: Zod validation → Turnstile check → rate limit → write to Sanity and/or email provider → notification email → success state.

### Shared form pipeline

1. Client: React Hook Form + Zod, inline errors, disabled submit while pending, honeypot field.
2. Server Action: re-validate with the same Zod schema; verify Turnstile token; rate limit by IP hash (5 submissions / 10 min / form).
3. Persist: create document with a server-only Sanity write token (never exposed to the browser).
4. Notify: transactional email to the right inbox (from `contactPage.enquiryTypes.routeToEmail` or siteSettings) and a confirmation to the user.
5. Respond: success state with animation; errors logged to Sentry (or Vercel logs) without personal data.

### Newsletter (Phase 3)

- **Adapter interface** in `/lib/forms/email-provider.ts`: `subscribe({email, firstName?, tags[], source})`, `unsubscribe`, `addTag`. Implementations: `BrevoProvider`, `MailchimpProvider`, `NullProvider` (logs only, for development). Selected by environment variable so switching providers is a config change.
- **Double opt-in** through the provider; tags record the source (footer, modal, article, event RSVP).
- **Entry points**: nav pill (slide-in modal), footer form, `newsletterBlock`, end of every article, RSVP and story forms (opt-in checkbox, unticked by default).
- **Recommendation**: Brevo (generous free tier, transactional email in the same account). Final choice is an open question (Section 10).

### Share your story (Phase 4)

- Fields: display name or "post anonymously" toggle, email (required, private, for follow-up only), title, story (min 200 / max 5,000 characters), themes, optional age range and country, optional photo (max 5 MB, JPG/PNG/HEIC, EXIF stripped), content warning, three consents (publish, light editing, contact me).
- Creates a `story` document with status `submitted` as a **draft only**; nothing goes live until a moderator uses **Approve & publish**.
- Emails: confirmation to submitter; alert to the moderators' inbox. On approval or rejection, an optional templated email to the submitter.
- Withdrawal: each confirmation email includes a link to request removal; removal sets status `withdrawn` and unpublishes.

### Events RSVP and calendar (Phase 4)

- Internal RSVP form: name, email, attendance, optional question for the host, newsletter opt-in. Capacity check in a transaction; waitlist when full.
- Confirmation email includes the event details, the private join link for online events, and an .ics attachment.
- Add-to-calendar menu: Google Calendar link, Outlook link, Apple/other (.ics from `/api/ics/[eventId]`). Times converted using the event's timezone.
- Reminder emails 24 hours and 1 hour before the event via a Vercel Cron job (Phase 5).
- External mode: button links to `externalRsvpUrl` instead of the form.

### Contact (Phase 3)

Enquiry type select (Partnership, Media, General, editable), name, email, organisation (optional), message. Routes to the inbox set per enquiry type; stores a `contactSubmission` unless the client prefers email-only.

### Volunteer / partner signup (Phase 6)

Two tabs on one page (Volunteer / Partner organisation) with tailored fields; creates `volunteerApplication`; notifies the partnerships inbox.

### Donations (Phase 6)

- Provider chosen in Phase 6. Options: **Paystack** (cards and mobile money in Ghana and other African markets), **Stripe** (international cards), or an **external** link (e.g. a fundraising platform) for the simplest launch.
- Build: amount tiers from CMS, custom amount, one-off/monthly toggle, hosted checkout redirect (no card data touches our servers), webhook → thank-you email and page.
- Legal: the client confirms registration status and receipt wording before go-live.

### Privacy and safety

- Consent text for every form is managed in Sanity and stored with the submission.
- Personal data never appears in public GROQ queries; retention: contact submissions 12 months, RSVPs 6 months after the event, rejected stories 90 days (automated cleanup job).
- Privacy policy page lists the processors (Vercel, Sanity, email provider, Turnstile, analytics).
- The site is information, not medical advice: disclaimer on every Learn page and in the footer.

## 8. Non-functional requirements

Every release must pass these targets in CI before it reaches production.

| Area | Target | How we check |
| --- | --- | --- |
| Performance | Lighthouse mobile ≥ 90 on Home, Article, Event; LCP < 2.5s, INP < 200ms, CLS < 0.1 on a mid-range Android over 4G | Lighthouse CI on every PR; Vercel Speed Insights in production |
| JS budget | < 180 KB gzipped first-load JS on content pages; GSAP only on pages with exaggerated moments | `next build` output + bundle analyzer |
| Hero video | ≤ 4 MB for a 10–15s loop, 1080p max; poster shown first; not loaded with Save-Data or reduced motion | Manual + Lighthouse |
| Accessibility | WCAG 2.2 AA: keyboard nav for menus/carousels/tabs, visible focus, skip link, alt text required in CMS, captions on video, pause on all auto-moving content, reduced-motion support, form errors announced | axe-core in Playwright; manual screen-reader pass (NVDA + VoiceOver) |
| SEO | Metadata API per route from `seo` fields; sitemap.xml and robots.txt generated; canonical URLs; JSON-LD: Organization, Article (with reviewedBy), Event, FAQPage, DefinedTerm (glossary), BreadcrumbList; dynamic OG images | Rich Results Test; Search Console |
| Security | Server-only write tokens; webhook secret; CSP and security headers; Turnstile on all forms; dependency audit in CI; Studio behind Sanity SSO | Headers check, `npm audit` |
| Privacy | Cookieless analytics; no third-party embeds load before consent (YouTube via facade); data retention jobs | Manual review |
| Browser support | Last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 16+; Android Chrome | Playwright + BrowserStack spot checks |
| Resilience | Graceful empty states (no events, no stories); 404 and 500 pages; images have LQIP | Playwright |
| Content ops | Editors can publish without developers; preview of drafts; publish reflects live in < 10s | UAT script |

## 9. Development phases

Launch (Core + Community) is estimated at 12 weeks across Phases 0–5; Phase 6 (Future Enhancements) adds about 4 weeks whenever the client is ready. Durations are estimates for one designer and two developers and are confirmed at the end of Phase 0.

```
Phase 0        Phase 1          Phase 2          Phase 3          Phase 4            Phase 5           ║  Phase 6
Discovery &    Design system,   Core pages &     Newsletter &     Stories, events,   Hardening &       ║  Experts, volunteer,
setup          shell            Learn            contact          glossary           launch            ║  donations
Week 1         Weeks 2-3        Weeks 4-6        Week 7           Weeks 8-10         Weeks 11-12       ║  ~4 weeks, post-launch
                                                                                         LAUNCH GATE: UAT signed off
```

Phases 0–5 run in sequence to the launch gate; Phase 6 starts whenever the client is ready, on the live site.

### Phase 0 — Discovery and setup (week 1)

- [ ] Kickoff workshop: confirm sitemap, content owners, moderation workflow, launch date
- [ ] Receive logo SVGs and any existing photos/video; confirm the font pairing proposed in Section 4
- [ ] Content audit: list of launch articles, glossary terms, Founding Circle bios, first events, legal pages
- [ ] Create accounts owned by the client: GitHub org, Vercel team, Sanity project, domain DNS, email provider (provisional)
- [ ] Scaffold repo: Next.js (TypeScript strict), Tailwind, ESLint/Prettier, Husky, Vitest, Playwright, GitHub Actions
- [ ] Create Sanity project with `development` and `production` datasets; embed Studio at /studio; CORS and tokens
- [ ] Vercel project with preview deployments and environment variables
- [ ] Wireframes (low-fi) for Home, Learn hub, Article, Events, Event, Stories, Share your story

**Deliverables:** running empty site + Studio on preview URL; approved wireframes; content plan. **Acceptance:** client signs off wireframes and the feature-to-phase table in Section 1.

### Phase 1 — Design system and foundations (weeks 2–3)

- [ ] High-fidelity designs: Home (desktop + mobile), Article, Event, Story, Learn hub, form states, nav + mega menu, footer
- [ ] Motion prototype of the five exaggerated moments (short video or coded prototype) for sign-off
- [ ] Theme system per Section 4: theme.config.ts, .env overrides, build-theme script, generated CSS variables, Tailwind mapping, contrast test in CI; then radius, spacing and motion tokens
- [ ] Font loading with `next/font/local`
- [ ] UI primitives: Button, Eyebrow, Card variants, Tabs, Accordion, Dialog/slide-in, form fields, Toast, Badge
- [ ] Motion primitives: `Reveal`, `Stagger`, `SplitHeadline`, `CountUp`, `ScrollPin`, `Parallax`, Lenis provider, reduced-motion hook
- [ ] Layout shell: announcement bar, floating pill nav with mega menu, mobile menu, footer
- [ ] Sanity: shared objects (`seo`, `link`, `cta`, `heroMedia`, `hero`, `richText`, `socialLink`, `address`, `navGroup`, `navItem`, `stat`, `faqItem`)
- [ ] Sanity singletons: `siteSettings`, `navigation`, `footer`, `announcementBar`; desk structure skeleton
- [ ] Typed fetch helper, cache tags, revalidation webhook, draft mode + Presentation tool
- [ ] Storybook-style component page at /dev/components (hidden in production)

**Deliverables:** approved designs; shell (nav, footer, announcement) fully driven by Sanity. **Acceptance:** changing socials, address or nav in Studio updates the live preview within 10 seconds; keyboard can operate the mega menu.

### Phase 2 — Core pages and Learn hub (weeks 4–6)

- [ ] Page-builder blocks: hero, missionStatement, pillars, stats, problemSolution, featuredArticles, cta, richText, imageText, media, faq, teamGrid, logoCloud, testimonial
- [ ] Homepage singleton seeded with default section order; exaggerated moments 1–4 implemented
- [ ] Hero image/video handling: poster, captions, overlay control, Save-Data and reduced-motion fallbacks
- [ ] About page with Founding Circle (`teamMember`) and pillars
- [ ] Learn hub: `article`, `category`, `author` schemas; hub page, category listing with filters (type, tag), article template with TOC, myth/fact cards, doctor-questions checklist (print stylesheet), sources, reviewer and last-reviewed date, related articles
- [ ] Community guidelines, privacy, terms, medical disclaimer, accessibility statement as `page` docs
- [ ] Generic `/[slug]` page route
- [ ] SEO: Metadata API, sitemap, robots, Organization + Article + Breadcrumb JSON-LD, OG images
- [ ] Studio: Learn desk views (by type, Review due, drafts), validation and helper text

**Deliverables:** Home, About, Learn hub, articles and legal pages live on staging with sample content. **Acceptance:** an editor creates, previews and publishes an article with no developer help; Lighthouse ≥ 90 on Home and Article.

### Phase 3 — Core forms: newsletter and contact (week 7)

- [ ] Form pipeline (Zod, Server Actions, Turnstile, rate limiting, honeypot)
- [ ] Email provider adapter with Brevo, Mailchimp and Null implementations; double opt-in; source tags
- [ ] Transactional email templates (React Email): confirmation, internal notification
- [ ] Newsletter entry points: nav slide-in, footer, block, article end, /newsletter page
- [ ] Contact page with enquiry routing and `contactSubmission` storage
- [ ] Success/error states with motion

**Deliverables:** working newsletter and contact on staging, connected to a test list. **Acceptance:** subscribing from each entry point lands in the provider with the right tag; contact messages reach the right inbox by type.

### Phase 4 — Community features (weeks 8–10)

- [ ] Share your story: `shareStoryPage` + `story` schemas, form with anonymous option and consents, photo upload with EXIF stripping, draft creation
- [ ] Stories inbox in Studio with Approve & publish / Request changes / Reject actions and email notifications
- [ ] Stories listing (theme filters) and story page; stories carousel block (exaggerated moment 5)
- [ ] Events: `event` and `eventRsvp` schemas; listing with type tabs, list + month calendar view, past archive; event page
- [ ] RSVP form with capacity/waitlist; confirmation email with private join link and .ics; add-to-calendar menu (Google, Outlook, Apple)
- [ ] Upcoming events block on homepage; Event JSON-LD
- [ ] Glossary: `glossaryTerm` schema; A–Z page with live filter; term pages; glossary tooltips inside articles; DefinedTerm JSON-LD
- [ ] Community guidelines linked from story form and events

**Deliverables:** all Community features live on staging. **Acceptance:** an anonymous story never shows a name anywhere; a submitted story is invisible until approved; RSVP sends .ics that imports correctly in Google, Outlook and Apple Calendar; past events leave the upcoming list automatically.

### Phase 5 — Hardening, content and launch (weeks 11–12)

- [ ] Motion polish pass and reduced-motion audit of every animation
- [ ] Site search across Learn and Glossary
- [ ] Event reminder emails (Vercel Cron); data-retention cleanup job
- [ ] Accessibility audit (axe + manual screen reader), fixes
- [ ] Performance pass: image sizes, video weight, bundle split, font subsetting
- [ ] Security headers/CSP, error monitoring, uptime check
- [ ] Content entry support: client loads launch content; Yenko reviews
- [ ] Editor training (2 sessions, recorded) + written Studio guide
- [ ] UAT with client against the acceptance criteria; bug bash
- [ ] Launch: DNS cutover, production dataset check, Search Console + sitemap submission, analytics verification
- [ ] 2-week post-launch warranty and hypercare

**Deliverables:** live production site; training recordings; Studio guide; handover document. **Acceptance:** all Section 8 targets pass; client signs off UAT.

### Phase 6 — Future Enhancements (post-launch, \~4 weeks)

- [ ] Expert directory: `expert` + `specialty` schemas, listing with filters (specialty, country/city, telehealth), expert profile, "verified" badge, suggestion form; clear disclaimer that listing is not an endorsement
- [ ] Volunteer / partner signup: page with two tabs, `volunteerApplication` schema, Studio inbox, notifications
- [ ] Donation page: choose provider (Paystack / Stripe / external), `donatePage` singleton, tiers, one-off/monthly, hosted checkout, webhook, thank-you email and page
- [ ] Activate "Act" menu group in navigation
- [ ] Optional: second language via document internationalisation

**Deliverables:** Act section live. **Acceptance:** a test donation completes end to end in the provider's test mode; expert filters return correct results; applications reach the partnerships inbox.

## 10. Open questions, risks and handover

Six decisions are still open; none blocks Phase 0, but items 1–3 must be settled before Phase 3.

### Open questions

- [ ] Email provider: Brevo (recommended) or Mailchimp? Who owns the account?
- [ ] Who moderates stories, and what is the target turnaround (e.g. 5 working days)?
- [ ] Should contact and volunteer submissions be stored in Sanity, or emailed only?
- [ ] Terminology and SEO: use "PMOS" alone, or pair it with the older term people still search for?
- [ ] Domain name and the public emails to show (contact, media, partnerships)
- [ ] Donation provider and registration status (needed before Phase 6)

### Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Launch content not ready (articles, bios, glossary) | Launch slips or ships with thin pages | Content plan in Phase 0; content entry starts in Phase 2 on staging; empty states designed |
| Health information inaccurate or outdated | Harm to readers, loss of trust | Medical reviewer field, last-reviewed date, "Review due" Studio view, disclaimer |
| Personal data exposure from stories or RSVPs | Privacy breach | Private fields excluded from public queries, server-only tokens, retention jobs, anonymous mode tested in UAT |
| Heavy hero video and animation slow on mobile data | Poor performance, high bounce | Video budget, Save-Data and reduced-motion fallbacks, GSAP code-split, Lighthouse CI gate |
| Spam on open forms | Moderator overload | Turnstile, honeypot, rate limits, all stories moderated |
| Sanity plan limits (users, custom roles, datasets) | Roles in Section 6 not available on free plan | Confirm plan in Phase 0; apply for Sanity's nonprofit programme if eligible |

### Handover package (end of Phase 5)

- Repository access transferred to the client's GitHub org; README with setup, environment variables and deploy steps
- Studio editor guide (how to publish articles, moderate stories, create events, update hero, footer, socials)
- Training recordings
- Architecture and schema reference (this document, kept up to date)
- Accounts list and who holds admin on each

### Sources

- [Radiating Hope homepage](https://www.radiatinghope.org/) (blueprint)
- [The Institute for Women's Health homepage](https://www.theiwh.org/) (secondary inspiration)
- Cysters In Action: Website Feature Selection (Yenko Studio, client PDF)
