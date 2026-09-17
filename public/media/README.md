# /public/media — where real Quik Burrito photography goes

Nothing in this folder yet. Every image slot on the site currently renders an
art-directed placeholder, because generated food must never be passed off as a
photograph of Quik Burrito's actual dishes.

## How to replace a placeholder

1. Drop the file in the path listed below (JPG, PNG, WebP or AVIF — Next.js
   converts and resizes on the fly).
2. Point the code at it:
   - **Menu items** — set `image: 'menu/<file>'` on the item in `data/menu.ts`.
   - **Scene subjects** — pass `src="<path>"` to `<FoodSubject>` / `<FoodPlate>`.
3. Write a truthful `alt` describing what the photo actually shows.
4. When all slots are filled, set `showSlotBadges: false` in `data/media.ts`.

## Slots the site expects

### Menu (`menu/`)
| File | Dish |
| --- | --- |
| `menu/surf-and-turf.jpg` | Surf & Turf Burrito |
| `menu/phx-burrito.jpg` | PHX Burrito |
| `menu/burrito.jpg` | Burrito |
| `menu/breakfast-burrito.jpg` | Breakfast Burrito |
| `menu/birria-tacos.jpg` | Birria Tacos |
| `menu/tacos.jpg` | Tacos |
| `menu/qb-fries.jpg` | Fries |
| `menu/nachos.jpg` | Nachos |
| `menu/quesadilla.jpg` | Quesadilla |

### Cinematic scenes
| Slot name | Shot |
| --- | --- |
| `hero-burrito` | Hero burrito on the prep counter, warm, slight steam |
| `cross-section` | Burrito cut open, ingredients visible |
| `birria-dip` | Birria taco being dipped into consommé |
| `breakfast-burrito` | Breakfast burrito in morning light |
| `takeout-bag` | Finished order / branded bag on the counter |
| `bitten-burrito` | Burrito with a bite taken, wrapper open |

### Brand (`brand/`)
| File | Use |
| --- | --- |
| `brand/logo.svg` | Replaces the text wordmark in `components/Logo.tsx` |
| `brand/og.jpg` | 1200×630 social share image |

## Video (`video/`)

The Instagram reel is embedded from instagram.com by default. That works on a
normal domain, but the frame is blocked anywhere with a strict frame policy —
including the shareable preview — so the page shows a link out to Instagram
instead of an empty box.

**Self-hosting the file is better on every axis**: it plays inline everywhere,
starts faster than the embed, and depends on nothing outside the site.

| File | What |
| --- | --- |
| `video/reel.mp4` | The reel. H.264 / AAC, around 1080×1920, ideally under ~8MB so it starts quickly on cellular. |
| `video/reel-poster.jpg` | A still from the first second, shown before playback. |

Then fill in `videoAssets` in `data/media.ts`. The page switches to a native
player automatically — muted, looping, and playing only while on screen.

Quik Burrito can export their own reel from the Instagram app (their post →
**⋯ → Download**) or from the Meta Business Suite content library. It is their
footage, so it is theirs to re-host.

## Shooting notes

Warm directional light, shallow depth of field, food filling the frame. Shoot
vertical crops too — mobile reframes the food vertically rather than letterboxing
the desktop crop.
