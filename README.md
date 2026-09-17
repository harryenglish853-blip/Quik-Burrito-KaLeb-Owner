# Quik Burrito — Arizona

A cinematic, conversion-first restaurant site for **Quik Burrito** (Anthem, Arizona).

The homepage is one continuous scroll-scrubbed journey through the food, the
kitchen, the restaurant and the people, ending on the order button. Every page
underneath it — menu, locations, reviews — is fast, plain and usable on a phone
with one hand.

**The site's one job: make somebody hungry, then get them to ORDER ONLINE in one tap.**

---

## Showing this to the client

```bash
npm install
npm run build && npm start      # http://localhost:3000
```

Use the production build for a demo, not `npm run dev` — dev mode recompiles on
navigation and the cinematic scroll stutters.

**Walk it in this order.** Scroll slowly; the camera is tied to the wheel, so
the pace is yours. Scroll back up anywhere and the move runs in reverse.

1. **The hero** — brand, tagline and ORDER ONLINE are on screen in the first
   frame. Nothing to wait through.
2. **Scroll through the chapters** — burrito, ingredients, grill, the build,
   the signature dishes (watch focus move dish to dish), the birria dip,
   breakfast opening into Arizona morning light, the restaurant through the day.
3. **Tap MENU from anywhere** — it opens instantly. Point out it never waits on
   the scroll.
4. **The reviews section** — this is the honest one. Worth a sentence: no
   testimonial is invented, and the moment they hand over real reviews it fills
   in automatically.
5. **Locations** — pick the store, watch the phone, hours and ordering follow it.
6. **Resize to a phone**, or open it on one. The composition restacks — it is
   not the desktop layout shrunk down.
7. **End on the finale** — the largest ORDER ONLINE on the site.

### The photo slots are the ask

Every image is a labelled frame at the exact size and crop the real photograph
will occupy. Leave them visible in the meeting — they make the request concrete
and they are the fastest way to get the assets. The site is built so that
dropping in real photography finishes it without touching a line of animation.

If you would rather present without them, it is one line — set
`showSlotBadges: false` in `data/media.ts` and rebuild. The frames stay; only
the labels go.

### What to say about the colours

The palette and type come straight off their badge: black, `#FDFD00` yellow and
white, with Archivo Black matching the PHX / AZ lettering. The one thing still
worth asking for is the **vector original** of the logo — the current file is a
raster crop of a JPEG, so it is soft at large sizes.

---

## The shareable preview

```bash
npm run build:preview      # static export into ./out
```

`./out` is a self-contained copy of the site that runs from any directory — open
`out/index.html` behind any static server, drop the folder on any host, or
publish it as a link. Nothing in it needs Node.

The preview is deliberately **one page**. The cinematic homepage already carries
the menu, the reviews and the locations, so in preview mode the nav links become
in-page anchors rather than routes that would have nowhere to go. That switch
lives in `lib/preview.ts` and `components/SmartLink.tsx`, and is driven by
`NEXT_PUBLIC_PREVIEW`; the real build is untouched and keeps its routes.

Three things the export does that are worth knowing:

- **Fonts** come from Google Fonts instead of being self-hosted. `next/font`
  refuses the relative `assetPrefix` the export needs, so `scripts/build-preview.mjs`
  swaps `lib/fonts.ts` for `lib/fonts.preview.ts` for the duration of the build
  and always restores it.
- **`_next` is renamed to `qb-assets`**, because some static hosts reserve paths
  starting with an underscore.
- **Asset URLs are relative**, so the export works from a subdirectory.

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
| `npm run brand:extract <logo>` | Reads the brand palette out of a logo file |
| `npm run build:preview` | Static, self-contained export into `./out` |
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
5. **Match the brand.** Confirm colours and type against the real logo — see
   *Brand colour and type* below — then set `brandVerified: true` in
   `data/theme.ts`.
6. **Add coordinates** from the Google Business Profile to enrich structured data.
7. Set `NEXT_PUBLIC_SITE_URL` to the real domain (used by canonical URLs,
   sitemap, robots and structured data).

`npm run prelaunch` tracks all of this.

---

## Brand colour and type

**Everything brand lives in two files.**

| What | Where |
| --- | --- |
| Colours | `data/theme.ts` |
| Fonts | `lib/fonts.ts` |
| Logo file | `data/media.ts` → `brandAssets` |

`components/ThemeStyle.tsx` turns `data/theme.ts` into the CSS custom properties
every stylesheet reads, injected in `<head>` before first paint. No component or
stylesheet declares a brand colour of its own, so changing the palette is one
edit — not a search-and-replace across a dozen files.

### The palette comes from the badge

Quik Burrito's logo is a circular badge: a black field, a bright yellow outer
ring, a white inner ring, and a foil-wrapped burrito in high-contrast stencil
with PHX and AZ underlined in yellow. `npm run brand:extract` read it directly:

| Colour | Hex | Coverage | Role on the site |
| --- | --- | --- | --- |
| Black | `#000000` | 17.6% | Brand surfaces, the cinematic scenes, the footer |
| White | `#FFFFFF` | 13.3% | Type on black, the utility pages |
| Yellow | `#FDFD00` | 8.3% | Every primary action, rules and kickers |

Three colours on the badge, three on the site. Black carries the surfaces,
white carries the type, yellow carries the action.

**Contrast.** Black on yellow is 19.2:1 and white on black is 21:1 — both past
WCAG AAA. Yellow is never set as type on white, where it measures 1.07:1 and is
effectively invisible. The one full-yellow moment, the ordering finale, inverts
instead: black headline, and a black button with yellow lettering.

**Type.** The PHX / AZ lettering is a heavy, slightly wide grotesque with flat
terminals. Archivo Black is the closest match on Google Fonts and is what the
site uses. If the badge was set in a licensed face, send the files and it can be
self-hosted — a change to `lib/fonts.ts` only.

**The underline device.** PHX and AZ are both underlined in yellow on the badge.
That rule is reused site-wide under every kicker and eyebrow, so the brand reads
even in places the logo does not appear.

**For the logo itself**, save it to `public/media/brand/` and name it in
`data/media.ts`:

```ts
export const brandAssets = {
  logo: 'logo.svg',
  logoLight: 'logo-light.svg',   // light-on-dark, for the cinematic scenes
};
```

The type-set wordmark is replaced automatically. Until then the fallback
wordmark uses the brand display font and brand colour, so the site is never
missing its name.

**For type**, `lib/fonts.ts` holds the active pair plus a table of candidates.
Only the active pair is imported on purpose: `next/font` emits `@font-face` for
everything imported, so a shelf of unused fonts would cost every visitor real
download time on a site whose whole job is speed.

The food and Arizona tones in `theme.scene` are scene art direction rather than
brand identity, and deliberately stay put when the brand colours change.

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
                          brand, theme (colour), media, verification contract
lib/                      Location + menu-drawer context, analytics, device
                          tier, fonts (typography)
styles/                   globals · chrome · cine · scenes · pages · plate
scripts/                  prelaunch report · end-to-end verification ·
                          brand colour extraction
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
