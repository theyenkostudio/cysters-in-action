# Design prototype (saved copy)

The design lives in a Claude design canvas:
**https://claude.ai/artifact/DqWU7Q1DL9EcJHHDR3d9N6**
(shared with anyone who has the link). That is the source of truth. Open it to see the pages side by side and click through them.

`prototype/` holds a copy of every page's markup and the canvas layout, so the work isn't lost if the link goes away.

| File | Page |
|------|------|
| `Main.dc.html`, `Mobile.dc.html` | Home, desktop and mobile |
| `MobileMenu.dc.html` | Mobile menu, open |
| `Learn`, `Connect`, `Act`, `About`, `Donate` (`.dc.html`) | Inner pages, desktop |
| `LearnMobile`, `ConnectMobile`, `ActMobile`, `AboutMobile`, `DonateMobile` | Inner pages, mobile |
| `HiveA` to `HiveD` | Four alternative "community hive" concepts (not used) |
| `canvas.json` | Where each page sits on the canvas, and its size |

Notes:
- These are design-tool files, not app code. Open them as reference. The real app is in `app/` and `components/`.
- Photos in the files point to the design tool's own storage (`/_blob/...`) and won't show here. The same stock photos are in `public/images/`.
- The prototype is ahead of the app: Learn, Connect, Act and About are designed but not built in Next.js yet. See `docs/11-handoff.md`.
