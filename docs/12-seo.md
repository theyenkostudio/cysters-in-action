# SEO

Status: built and checked in the production build (head tags, robots, sitemap, structured data).

## Switching it on
The site is **hidden from search engines by default**. It stays hidden until both of these are set in the hosting environment (see `.env.example`):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | The real address, no trailing slash, for example `https://example.org` |
| `SEO_INDEXABLE` | `true` |

Why: the site still has stock photos and "[To confirm]" placeholder text, and there's no real address yet. Without both settings every page is `noindex, nofollow` and `robots.txt` disallows everything. **Set these only when the site is ready to be found.**

## What's in place
- **Titles:** the home page is "Cysters in Action: a community for people living with PMOS" (59 characters). Other pages use "Page name · Cysters in Action".
- **Descriptions:** one per page, under 160 characters. The home one mentions "PMOS (formerly PCOS)" because many people still search for PCOS.
- **Canonical address** on every page.
- **Sharing cards** (Facebook, LinkedIn, X, messaging apps): title, description and a 1200 x 630 image (`app/opengraph-image.jpg`, `app/twitter-image.jpg`). The image is currently the hero stock photo.
- **`robots.txt` and `sitemap.xml`:** generated. The sitemap lists only pages that exist (Home, Donate).
- **Structured data** (Organization and WebSite): only published once the site is set to indexable, so no placeholder address reaches search results.
- **Theme colour,** language (`en`), one `h1` per page, descriptive image text, a fast-loading hero photo.
- Helper for new pages: `pageMetadata({ title, description, path })` in `lib/seo.ts`.

## When you add a page
1. Export `metadata = pageMetadata({ title, description, path })` from the page.
2. Add it to `paths` in `app/sitemap.ts`.
3. Keep one `h1`.

## Not done yet, and why
- **FAQ structured data.** Several answers are still placeholders. Marking them up would send "[To confirm]" text to Google. Add it once the answers are final.
- **Logo and app icons.** Only the default `favicon.ico` exists. There's no logo or brand mark yet (see the brand question in [02-open-questions.md](02-open-questions.md)), so no Apple touch icon, no web manifest, and no logo in the structured data.
- **A real sharing image.** Replace the stock photo with branded artwork or a real community photo.
- **Social profile links** (`sameAs`) and contact details in the structured data, once they exist.
- **Search Console and analytics:** verify the site and submit the sitemap after launch.
- **Content for search:** the Learn articles are what will bring people in. Plain-language PMOS and PCOS guides, with sources and a review date, are the biggest SEO opportunity.
