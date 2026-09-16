import React from 'react';
import { theme } from '@/data/theme';

/**
 * Turns data/theme.ts into the CSS custom properties every stylesheet reads.
 *
 * This is why the brand lives in one file: nothing else in the codebase
 * declares a brand colour, so swapping Quik Burrito's palette is a single edit
 * rather than a search-and-replace across a dozen stylesheets.
 *
 * Rendered in <head> from the root layout, so the tokens are in place before
 * the first paint — no flash of the wrong colour.
 */
/** '#rrggbb' -> 'r, g, b' so stylesheets can build rgba() from a theme colour. */
function channels(hexColor: string): string {
  let v = hexColor.replace('#', '');
  if (v.length === 3) v = v.split('').map((ch) => ch + ch).join('');
  const n = parseInt(v, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export function ThemeStyle() {
  const c = theme.colors;
  const s = theme.scene;

  const css = `:root{
--brand:${c.primary};
--brand-hot:${c.primaryHot};
--on-brand:${c.onPrimary};
--chile:${c.primary};
--sun:${c.accent};
--sunset:${c.accentDeep};
--ink:${c.ink};
--ink-soft:${c.inkSoft};
--char:${c.ink};
--paper:${c.paper};
--cream:${c.surface};
--masa:${s.masa};
--tortilla:${s.tortilla};
--char-soft:${s.charSoft};
--asada:${s.asada};
--salsa:${s.salsa};
--cilantro:${s.cilantro};
--lime:${s.lime};
--steel:${s.steel};
--paper-rgb:${channels(c.paper)};
--surface-rgb:${channels(c.surface)};
--brand-rgb:${channels(c.primary)};
--accent-rgb:${channels(c.accent)};
}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
