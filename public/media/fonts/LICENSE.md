# Font licences

Two webfont files are redistributed in this repository. Both are licensed under
the **SIL Open Font License, Version 1.1 (OFL-1.1)**, which permits commercial
use, embedding and redistribution.

| File | Family | Upstream |
| --- | --- | --- |
| `archivo-black-latin.woff2` | Archivo Black, © Omnibus-Type | https://github.com/Omnibus-Type/ArchivoBlack |
| `inter-latin.woff2` | Inter, © The Inter Project Authors | https://github.com/rsms/inter |

These are the latin subsets that `next/font` downloads during a normal build;
`npm run fonts:extract` regenerates them.

## Outstanding: add the verbatim licence text

> The OFL requires that the licence and copyright notice accompany the font
> files wherever they are redistributed. Linking to it is not sufficient.

The verbatim `OFL.txt` could not be fetched from the build environment, so it is
**not yet in this folder**. Before the site goes live, copy each project's
licence file from its repository into this directory:

```
public/media/fonts/OFL-ArchivoBlack.txt     # from Omnibus-Type/ArchivoBlack
public/media/fonts/OFL-Inter.txt            # from rsms/inter
```

Take the exact copyright line from each upstream file rather than retyping it —
the notice has to match the one the authors published.

`npm run prelaunch` reports this until both files are present.

## If you would rather not redistribute fonts at all

Delete this folder and the two `@font-face` rules in `app/layout.tsx`, and the
preview falls back to Google Fonts. That removes the obligation, at the cost of
an external request the preview currently does not make. The live site is
unaffected either way — it serves fonts through `next/font`, which handles
licensing and hosting itself.
