#!/usr/bin/env node
/**
 * Pull Quik Burrito's real brand palette out of their logo.
 *
 *   npm run brand:extract public/media/brand/logo.svg
 *   npm run brand:extract public/media/brand/logo.png
 *
 * SVG  — reads the fill / stroke / stop-color values declared in the file, so
 *        the hexes come back exactly as the designer set them.
 * PNG/JPG/WEBP — decodes the image with sharp, buckets the pixels by colour and
 *        reports the dominant ones by coverage, ignoring transparency and the
 *        near-white/near-black that logos sit on.
 *
 * It then prints a ready-to-paste `colors` block for data/theme.ts. Nothing is
 * written automatically — you look at the suggestion and decide.
 */
import { readFileSync, existsSync } from 'node:fs';
import { extname, resolve } from 'node:path';

const say = (s = '') => process.stdout.write(s + '\n');

const input = process.argv[2];
if (!input) {
  say('\n  Usage: npm run brand:extract <path-to-logo>');
  say('  e.g.   npm run brand:extract public/media/brand/logo.svg\n');
  process.exit(1);
}

const file = resolve(process.cwd(), input);
if (!existsSync(file)) {
  say(`\n  No file at ${input}`);
  say('  Save the logo there first, then run this again.\n');
  process.exit(1);
}

/* ---------------------------- colour helpers ---------------------------- */

const hex = (r, g, b) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

function toRgb(h) {
  let v = h.replace('#', '');
  if (v.length === 3) v = v.split('').map((c) => c + c).join('');
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

/** Relative luminance, per WCAG. */
function luminance([r, g, b]) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a, b) {
  const [l1, l2] = [luminance(toRgb(a)), luminance(toRgb(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

function saturation([r, g, b]) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

/** Nudges a colour brighter, for the primary hover state. */
function lighten(h, amount = 0.14) {
  const [r, g, b] = toRgb(h);
  return hex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

/** Nudges a colour darker, for gradient ends and pressed states. */
function darken(h, amount = 0.18) {
  const [r, g, b] = toRgb(h);
  return hex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

/* ------------------------------- readers ------------------------------- */

function fromSvg(path) {
  const src = readFileSync(path, 'utf8');
  const counts = new Map();

  const add = (h) => {
    const k = h.toLowerCase();
    counts.set(k, (counts.get(k) ?? 0) + 1);
  };

  for (const m of src.matchAll(/(?:fill|stroke|stop-color|flood-color)\s*[:=]\s*["']?\s*(#[0-9a-fA-F]{3,8})/g)) {
    add(m[1].slice(0, 7));
  }
  for (const m of src.matchAll(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/g)) {
    add(hex(+m[1], +m[2], +m[3]));
  }

  return [...counts.entries()]
    .map(([color, count]) => ({ color, weight: count }))
    .sort((a, b) => b.weight - a.weight);
}

async function fromRaster(path) {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    say('\n  Could not load `sharp`, which is needed to read a raster logo.');
    say('  Either run:  npm i -D sharp');
    say('  or export the logo as SVG and point this script at that instead.\n');
    process.exit(1);
  }

  // Downscale first: we want dominant colour, not every anti-aliased edge pixel.
  const { data, info } = await sharp(path)
    .resize(200, 200, { fit: 'inside', kernel: 'nearest' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const counts = new Map();
  const total = info.width * info.height;

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 200) continue; // transparent padding

    // Quantise to 24 levels per channel so near-identical pixels group together.
    const q = (v) => Math.round(v / 11) * 11;
    const key = hex(q(r), q(g), q(b));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([color, n]) => ({ color, weight: n, share: n / total }))
    .sort((a, b) => b.weight - a.weight);
}

/* -------------------------------- report -------------------------------- */

const ext = extname(file).toLowerCase();
const palette = ext === '.svg' ? fromSvg(file) : await fromRaster(file);

if (palette.length === 0) {
  say('\n  No colours found in that file.');
  say('  If it is an SVG whose colour comes from CSS classes, open it and read');
  say('  the hex values directly, then paste them into data/theme.ts.\n');
  process.exit(1);
}

say('');
say('  QUIK BURRITO — BRAND COLOURS FROM ' + input);
say('  ' + '='.repeat(52));
say('');
say('  Colours found, most prominent first:');
for (const p of palette.slice(0, 12)) {
  const share = p.share ? `${(p.share * 100).toFixed(1).padStart(5)}%` : `${String(p.weight).padStart(5)}×`;
  const rgb = toRgb(p.color);
  const tag =
    saturation(rgb) < 0.12 && luminance(rgb) > 0.8 ? 'near-white'
    : saturation(rgb) < 0.12 && luminance(rgb) < 0.12 ? 'near-black'
    : saturation(rgb) < 0.12 ? 'neutral'
    : 'colour';
  say(`    ${p.color}   ${share}   ${tag}`);
}
say('');

// Primary: the most prominent genuinely saturated colour.
const chromatic = palette.filter((p) => {
  const rgb = toRgb(p.color);
  return saturation(rgb) >= 0.35 && luminance(rgb) > 0.02 && luminance(rgb) < 0.92;
});

const primary = chromatic[0]?.color;
// Accent: next saturated colour that is clearly a different hue from primary.
const accent = chromatic.find((p) => primary && contrast(p.color, primary) > 1.6)?.color;

// Ink must be a genuinely dark NEUTRAL, not just a dark saturated brand colour —
// otherwise a deep red logo ends up setting the body-text colour.
const darks = palette
  .filter((p) => {
    const rgb = toRgb(p.color);
    return luminance(rgb) < 0.12 && saturation(rgb) < 0.45;
  })
  .sort((a, b) => luminance(toRgb(a.color)) - luminance(toRgb(b.color)));

const lights = palette
  .filter((p) => luminance(toRgb(p.color)) > 0.78)
  .sort((a, b) => luminance(toRgb(b.color)) - luminance(toRgb(a.color)));

if (!primary) {
  say('  No strongly saturated colour found — this logo may be a single');
  say('  neutral. Set `primary` in data/theme.ts by hand.\n');
  process.exit(0);
}

const onPrimary = contrast(primary, '#ffffff') >= 4.5 ? '#ffffff' : '#1a120b';

say('  Suggested block for data/theme.ts:');
say('  ' + '-'.repeat(52));
say('');
say('  colors: {');
say(`    primary: '${primary}',`);
say(`    primaryHot: '${lighten(primary)}',`);
say(`    onPrimary: '${onPrimary}',`);
say(`    accent: '${accent ?? palette[1]?.color ?? primary}',`);
say(`    accentDeep: '${darken(accent ?? primary)}',`);
say(`    ink: '${darks[0]?.color ?? '#1a120b'}',`);
say("    inkSoft: '#55432f',");
say(`    paper: '${lights[0]?.color ?? '#fff8ed'}',`);
say(`    surface: '${lights[0]?.color ?? '#fff8ed'}',`);
say('  },');
say('');
say('  ' + '-'.repeat(52));
say('');
say(`  Contrast check — text on primary: ${contrast(primary, onPrimary).toFixed(2)}:1 ` +
    `(${contrast(primary, onPrimary) >= 4.5 ? 'passes AA' : 'BELOW AA — pick a different onPrimary'})`);
say('');
say('  Review these, paste what looks right, then set brandVerified: true.');
say('');
