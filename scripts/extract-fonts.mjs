#!/usr/bin/env node
/**
 * Copies the latin subset of each next/font family into /public/media/fonts,
 * so the static preview can self-host them instead of calling Google Fonts.
 *
 * Run after `npm run build`, which is what downloads them.
 */
import { readdirSync, readFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CSS_DIR = '.next/static/css';
const OUT_DIR = 'public/media/fonts';

/** family name -> output filename */
const WANTED = {
  'Archivo Black': 'archivo-black-latin.woff2',
  Inter: 'inter-latin.woff2',
};

if (!existsSync(CSS_DIR)) {
  console.error('No .next build found. Run `npm run build` first.');
  process.exit(1);
}

const css = readdirSync(CSS_DIR)
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(join(CSS_DIR, f), 'utf8'))
  .join('');

mkdirSync(OUT_DIR, { recursive: true });

const face = /@font-face\{font-family:([^;]+);[^}]*?src:url\(([^)]+)\)[^}]*?unicode-range:([^};]+)/g;
const found = new Set();

for (const m of css.matchAll(face)) {
  const family = m[1].trim().replace(/^["']|["']$/g, '');
  const url = m[2];
  const range = m[3];
  // The basic-latin face is the one worth shipping; the rest are other scripts.
  if (!/u\+00\?\?/i.test(range)) continue;
  const out = WANTED[family];
  if (!out || found.has(family)) continue;

  const src = join('.next', url.replace(/^\/_next\//, ''));
  if (!existsSync(src)) {
    console.error(`  Missing ${src} for ${family}`);
    process.exitCode = 1;
    continue;
  }
  copyFileSync(src, join(OUT_DIR, out));
  found.add(family);
  console.log(`  ${family} -> ${OUT_DIR}/${out}`);
}

for (const family of Object.keys(WANTED)) {
  if (!found.has(family)) {
    console.error(`  Could not find a latin face for "${family}".`);
    console.error('  If you changed lib/fonts.ts, update WANTED in this script.');
    process.exitCode = 1;
  }
}
