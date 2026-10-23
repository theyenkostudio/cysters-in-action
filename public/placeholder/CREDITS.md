# Placeholder media credits

All images below are free-licence stock photography from Pexels (Pexels
licence: free to use, no attribution required — credited here anyway as good
practice). None depict real Cysters In Action staff, members, or stories;
all are either pure nature/object shots or close-ups of hands with no
identifiable faces, chosen deliberately so no stock photo could be mistaken
for a real person's story. **Every one of these is a placeholder** — swap
each file for real photography (or a real `heroMedia` upload in Sanity) as
part of Phase 0/5 content work. No hero video is included yet (see note at
the bottom).

| File | Source | Photographer |
| --- | --- | --- |
| `hero.jpg` | [Scenic Sunrise over Horizon with Clouds](https://www.pexels.com/photo/scenic-sunrise-over-horizon-with-clouds-29252410/) | Tuğba |
| `problem-solution.jpg` | [Close-up of Hand Holding Plant Against Sky](https://www.pexels.com/photo/close-up-of-hand-holding-plant-against-sky-325702/) | Victor Santos |
| `about-hero.jpg` | [Close-up of Hands Holds Together](https://www.pexels.com/photo/close-up-of-hands-holds-together-5684382/) | Thirdman |
| `cta-closing.jpg` | [Close up of People Hands Together](https://www.pexels.com/photo/close-up-of-people-hands-together-4125007/) | Shane |
| `learn-hub-hero.jpg` | [A Stack of Books on a Table](https://www.pexels.com/photo/a-stack-of-books-on-a-table-15130537/) | Darya Grey_Owl |
| `category-explainer.jpg` | [Person Holding A Green Plant](https://www.pexels.com/photo/person-holding-a-green-plant-1072824/) | Akil Mazumder |
| `category-mythbuster.jpg` | [Photo of Light Bulb](https://www.pexels.com/photo/photo-of-light-bulb-1495580/) | Eric Anada |
| `category-doctorguide.jpg` | [Close-up of a Woman Writing in a Notebook](https://www.pexels.com/photo/close-up-of-a-woman-writing-in-a-notebook-8572601/) | Анна Шаталова (Anna Shatalova) |
| `category-livingwell.jpg` | [Cozy Cup of Tea on a Plush Sofa in Sunlight](https://www.pexels.com/photo/cozy-cup-of-tea-on-a-plush-sofa-in-sunlight-32213617/) | Derya Nur |

Downloaded via Pexels' public image CDN (`images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg`)
at compressed widths (1200–1920px) appropriate to where each is used.

## Hero video

Not included in this pass. A 7-second Pexels clip ("Close up of Leaves
Swaying in the Wind" by Roman Odintsov,
https://www.pexels.com/video/close-up-of-leaves-swaying-in-the-wind-6543593/)
was identified as a good candidate, but Pexels' video CDN sits behind bot
protection that blocked scripted download in this environment, and without
it there was no way to confirm the file would land under the spec's 4 MB
budget. The hero currently ships image-only
(`heroMedia.mediaType: 'image'`); the component fully supports video
(poster, captions, loop, autoplay-muted, Save-Data/reduced-motion
fallback) — adding a real clip later is a one-field change in the
`homePage` fixture/document, no code change needed.

## Logo

No logo image file — `components/brand/Logo.tsx` is a CSS/SVG text wordmark
("Cysters" + "IN ACTION") using the theme's heading colour, standing in
until the client supplies the real SVG per spec.md's Phase 0 assumptions.
