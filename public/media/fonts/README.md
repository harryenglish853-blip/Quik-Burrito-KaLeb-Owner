# Fonts (preview build only)

Latin subsets of Archivo Black and Inter, extracted from what `next/font`
already downloads during a normal `npm run build`.

**The real site does not use these.** It self-hosts through `next/font`, which
subsets, preloads and versions the files itself.

They exist so the static preview export (`npm run build:preview`) is genuinely
self-contained: it previously pulled the two families from Google Fonts at
runtime, which meant a blocked or slow request left the whole page in a system
sans and the brand typography gone. Nothing in the export now reaches the
network.

To refresh after changing the typefaces in `lib/fonts.ts`:

```bash
npm run build                 # next/font downloads the new families
npm run fonts:extract         # copies the latin subsets here
```
