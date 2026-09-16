# Put the Quik Burrito logo in this folder

The site currently shows a type-set wordmark because no logo file exists here.

## What to add

| File | What it is | Required? |
| --- | --- | --- |
| `logo.svg` | The main logo. `.png` or `.webp` work too — SVG is best (sharp at any size, and the colour values can be read out of it exactly). | Yes |
| `logo-light.svg` | A light/white version for dark backgrounds, used over the cinematic scenes. | Optional |

## Then

1. Point the site at it in `data/media.ts`:

   ```ts
   export const brandAssets = {
     logo: 'logo.svg',
     logoLight: 'logo-light.svg',   // omit if you don't have one
   };
   ```

2. Pull the brand colours straight out of it:

   ```bash
   npm run brand:extract public/media/brand/logo.svg
   ```

   That prints the colours by prominence plus a ready-to-paste block for
   `data/theme.ts`, and checks the button text passes WCAG AA contrast.

3. Paste the block into `data/theme.ts` and set `brandVerified: true`.

`npm run prelaunch` will keep listing this until it's done.

## A note on file quality

A vector logo (SVG, AI, EPS, PDF) is worth chasing down — whoever made the sign
or the menu boards will have one. A screenshot of the logo off a website or a
photo of the storefront will work in a pinch for reading the colours, but it
will look soft on high-resolution screens.
