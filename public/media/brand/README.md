# Brand assets

| File | What it is |
| --- | --- |
| `logo.png` | The badge, cropped to the circle with a transparent background. This is what the site renders (`brandAssets.logo` in `data/media.ts`). |
| `logo-source.jpg` | The original file as supplied, kept for reference. Not used by the site. |

## Colours

Read out of the badge with `npm run brand:extract public/media/brand/logo.png`
and applied in `data/theme.ts`:

| Colour | Hex | Where it appears on the badge |
| --- | --- | --- |
| Black | `#000000` | The field |
| White | `#FFFFFF` | Inner ring, PHX / AZ, the foil illustration |
| Yellow | `#FDFD00` | Outer ring, the glow, the underlines |

## Still worth chasing

**A vector original** (SVG, AI, EPS or PDF). `logo.png` is a raster crop of a
JPEG, so it is soft at large sizes and carries some JPEG artefacting around the
yellow ring. Whoever produced the signage or the menu boards will have the
vector. Drop it in as `logo.svg` and set `logo: 'logo.svg'` in `data/media.ts`.

**A knockout version** (optional) — the badge without its own black field, for
placing directly on dark backgrounds. Save as `logo-light.svg` and set
`logoLight` in `data/media.ts`.
