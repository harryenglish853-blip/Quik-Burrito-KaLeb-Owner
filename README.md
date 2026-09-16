# Quik Burrito — Arizona

A cinematic, conversion-first restaurant site for **Quik Burrito** (Anthem, Arizona).

The homepage is one continuous scroll-scrubbed journey through the food, the
kitchen, the restaurant and the people, ending on the order button. Every page
underneath it — menu, locations, reviews — is fast, plain and usable on a phone
with one hand.

**The site's one job: make somebody hungry, then get them to ORDER ONLINE in one tap.**

---

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run prelaunch` | Lists every fact still awaiting verification |
| `npm run verify` | End-to-end browser checks (needs `npm i -D playwright`) |
| `npm run typecheck` | TypeScript, no emit |

---

## The rule this codebase is built around

**Nothing on this site is invented.**

No made-up prices, addresses, phone numbers, hours, menu items, ingredients,
reviewer names, star ratings, review counts, awards, founding dates or ordering
links. Where a fact could not be confirmed, the UI shows nothing rather than a
guess, and the gap is recorded so it can be filled before launch.

That rule is enforced in code, not by good intentions:

- `data/verification.ts` wraps every fact in `Verifiable<T>` with a `verified`
  flag and a `source`. Components read values through `show()`, which returns
  `null` for anything unverified — so unverified data physically cannot render.
- `data/reviews.ts` ships **empty**. Real review quotes exist publicly, but the
  reviewer display names, exact wording and dates could not be captured from an
  authoritative source during this build, and attributing a quote to an invented
  name is precisely the failure this guards against. Until real reviews are
  entered, the reviews section says so plainly and links to the live Yelp,
  Facebook, Nextdoor and Tripadvisor pages.
- `components/StructuredData.tsx` omits any field it cannot verify, and publishes
  **no** `aggregateRating` unless real rated reviews exist.
- `npm run prelaunch` prints everything still outstanding.

Run it any time:

```bash
npm run prelaunch
```

---

## What is verified and live

| Fact | Value | Source |
| --- | --- | --- |
| Location | Quik Burrito — Anthem | Yelp |
| Address | 3434 W Anthem Way, Anthem, AZ 85086 | Yelp |
| Phone | (480) 534-5768 | Yelp |
| Hours | Mon–Thu 8am–8pm · Fri–Sat 8am–9pm · Sun 8am–4pm | public map listing |
| Menu | Surf & Turf Burrito, PHX Burrito, Burrito, Breakfast Burrito, Birria Tacos, Tacos, Fries, Nachos, Quesadilla | public menu listings |
| Instagram | [@quikburrito](https://www.instagram.com/quikburrito/) | Instagram |

**Prices are deliberately absent.** The only prices found publicly were on
third-party delivery platforms, which are routinely marked up over in-store
pricing; publishing those as Quik Burrito's prices would be inaccurate. Every
item carries `price: null` and the UI routes to live ordering for current
pricing. Fill `price` in `data/menu.ts` with real in-store figures to show them.

Three Phoenix addresses (Thunderbird, Warner, Northern) are recorded as **closed**
in `data/locations.ts` so nobody is ever sent to a door that doesn't open.

---

## Before launch

1. **Confirm the ordering link.** `orderUrl` points at Quik Burrito's own
   ordering page. If there's a per-location deep link, put it in
   `data/locations.ts` and set `orderUrlIsLocationSpecific: true`.
2. **Confirm hours**, including holidays.
3. **Add real reviews** to `data/reviews.ts` — see the instructions at the top of
   that file. Copy the reviewer's public display name, the rating, the text
   verbatim, the date and the source URL. Fewer real reviews beat many fake ones.
4. **Add real photography.** See `public/media/README.md` for the exact filenames
   each slot expects, then set `showSlotBadges: false` in `data/media.ts`.
5. **Add coordinates** from the Google Business Profile to enrich structured data.
6. Set `NEXT_PUBLIC_SITE_URL` to the real domain (used by canonical URLs,
   sitemap, robots and structured data).

`npm run prelaunch` tracks all of this.

---

## Photography

No photo of Quik Burrito's real food was available for this build, and generated
food must never pose as a photograph of their actual dish. So each image slot
renders an art-directed, warmly-lit frame at **the exact size, crop and position
the real photograph will occupy**, tagged with what belongs there.

The camera choreography, lighting and pacing are all built against those frames,
so dropping in real photos completes the scenes without touching a single
animation. This is the single highest-impact change available: the site is
designed to be finished by Quik Burrito's own photography.

---

## Architecture

```
app/                      Routes (App Router)
  page.tsx                Cinematic homepage
  menu/                   Full menu page
  locations/[slug]/       Per-location page + local SEO
  reviews/  about/        Social proof, brand
  sitemap.ts  robots.ts  icon.svg
scenes/                   The 13 cinematic chapters + CineScene primitive
components/               Header, MenuDrawer, MobileOrderBar, actions,
                          LocationSelector, ReviewWall, FoodSubject, atmosphere
data/                     Single source of truth — locations, menu, reviews,
                          brand, media, verification contract
lib/                      Location + menu-drawer context, analytics, device tier
styles/                   globals · chrome · cine · scenes · pages · plate
scripts/                  prelaunch report · end-to-end verification
```

**All restaurant data lives in `data/`.** No component hardcodes an address,
phone number, ordering URL or menu item.

### How the cinematic layer works

`scenes/CineScene.tsx` is the whole engine. Each chapter is a tall section with a
sticky stage; scroll position scrubs a GSAP timeline, so the camera follows the
wheel exactly — scroll up and it runs backwards, stop and it settles. Timelines
are normalised to a duration of 1, so each scene's position numbers read as
fractions of that chapter's scroll.

**There is no WebGL anywhere.** Atmosphere (steam, heat haze, grill glow, sun
shafts, bokeh) is CSS and SVG. Nothing can fail to initialise, nothing blocks
first paint, and a GPU-less phone still gets the composition.

### Progressive enhancement

The first frame always renders. Every chapter is ordinary, readable HTML; GSAP
only adds transforms after mount.

- **JavaScript off** — brand, food, menu items, ORDER ONLINE, CALL and DIRECTIONS
  all present and working (verified in `scripts/verify.mjs`).
- **Reduced motion** — stages unpin, the long scroll collapses, one clean still
  per chapter. Pure CSS, no JS needed.
- **Device tiers** (`lib/device.ts`) — low-end, save-data and 2G devices get the
  static experience; GSAP is never even downloaded. Ordering always works.

### Conversion

- Primary `ORDER ONLINE` in the header, hero, finale, mobile bar, every location
  card and every menu item.
- A persistent mobile bar: big ORDER ONLINE plus MENU / CALL / DIRECTIONS, inside
  the safe area, with `<body>` reserving space so it never covers content.
- `MENU` opens a drawer instantly from anywhere — it never waits on the scroll.
- If an order URL were ever unverified, the primary button falls back to
  click-to-call rather than going dead.
- **No appointment language anywhere** — this is a restaurant. No booking, no
  scheduling, no consultations, no popups over the food.

### Analytics

`lib/analytics.ts` fires `order_online_click`, `call_click`, `directions_click`,
`menu_view`, `review_click`, `location_selected` and `instagram_click` into GA4
and Meta Pixel **when they are present**. This site loads no tracker on its own,
so nothing is sent until a provider is added and consent is handled.

### Instagram

The featured reel loads nothing from instagram.com until the visitor taps play —
until then it's an in-house poster frame. Instagram's embed script is heavy
enough to wreck mobile load time on a site whose whole job is speed.

---

## Deploy

**Vercel** (zero config):

```bash
npx vercel
```

Set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` in the project's environment
variables, then point the domain at it.

**Anywhere else** running Node 18+:

```bash
npm ci && npm run build && npm start     # serves on :3000
```

Or containerise it — it's a standard Next.js server app. Static export is not
used, because `/locations/[slug]` benefits from proper metadata per route.

---

## Verified build

```
npm install     ✓  no errors
npm run build   ✓  compiled successfully, 12 routes
npm run verify  ✓  all checks passed
```

Browser-verified at 375 / 390 / 430 / 768 / 1024 / 1440 / 1920 px and in
landscape, with reduced motion, and with JavaScript disabled: no blank screen,
no horizontal overflow, no console errors, no dead links.
