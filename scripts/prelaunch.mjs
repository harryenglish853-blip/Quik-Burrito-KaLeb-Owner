#!/usr/bin/env node
/**
 * Pre-launch report.
 *
 * Prints every fact the site is NOT yet confident about, so nothing unverified
 * reaches customers by accident. Run: npm run prelaunch
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dataDir = join(root, 'data');

let open = 0;
const say = (s = '') => process.stdout.write(s + '\n');

say('');
say('  QUIK BURRITO — PRE-LAUNCH REPORT');
say('  ' + '='.repeat(46));
say('');

say('  1. Unverified data (hidden from customers until confirmed)');
let found1 = false;
for (const file of readdirSync(dataDir)) {
  if (!file.endsWith('.ts') || file === 'verification.ts') continue;
  const src = readFileSync(join(dataDir, file), 'utf8');
  src.split('\n').forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('*') || t.startsWith('//') || t.startsWith('import')) return;
    if (t.startsWith('export const VERIFY')) return;
    if (/unverified\(|VERIFY_BEFORE_LAUNCH|VERIFY_ORDER_URL_BEFORE_LAUNCH/.test(t)) {
      open++;
      found1 = true;
      say(`     data/${file}:${i + 1}`);
    }
  });
}
if (!found1) say('     ✓ Nothing outstanding.');
say('');

say('  2. Location launch notes');
const locSrc = readFileSync(join(dataDir, 'locations.ts'), 'utf8');
const blocks = locSrc.match(/launchNotes:\s*\[([\s\S]*?)\n\s*\],/g) ?? [];
let found2 = false;
for (const block of blocks) {
  for (const n of block.match(/'((?:[^'\\]|\\.)*)'/g) ?? []) {
    open++;
    found2 = true;
    say(`     · ${n.slice(1, -1).replace(/\\'/g, "'")}`);
  }
}
if (!found2) say('     ✓ Nothing outstanding.');
say('');

say('  3. Customer reviews');
const reviewsSrc = readFileSync(join(dataDir, 'reviews.ts'), 'utf8');
const body = reviewsSrc.split('export const reviews')[1]?.split('];')[0] ?? '';
if (/locationId:/.test(body)) {
  say('     ✓ Verified reviews present.');
} else {
  open++;
  say('     · No verified reviews entered yet — the site links out to the live');
  say('       review pages instead of inventing testimonials.');
  say('       Add real ones in data/reviews.ts.');
}
say('');

say('  4. Brand identity (colour + type)');
const themeSrc = readFileSync(join(dataDir, 'theme.ts'), 'utf8');
if (/^\s*brandVerified:\s*true/m.test(themeSrc)) {
  say('     \u2713 Brand colours confirmed against the real logo.');
} else {
  open++;
  say('     \u00b7 Colours in data/theme.ts are NOT confirmed as Quik Burrito\u2019s.');
  say('       Run:  npm run brand:extract public/media/brand/logo.svg');
  say('       then paste the result and set brandVerified: true.');
}
for (const block of themeSrc.match(/launchNotes:\s*\[([\s\S]*?)\n\s*\],/g) ?? []) {
  for (const n of block.match(/'((?:[^'\\]|\\.)*)'/g) ?? []) {
    open++;
    say(`     \u00b7 ${n.slice(1, -1).replace(/\\'/g, "'")}`);
  }
}
say('');

say('  5. Photography');
const mediaSrc = readFileSync(join(dataDir, 'media.ts'), 'utf8');
if (/showSlotBadges:\s*true/.test(mediaSrc)) {
  open++;
  say('     · Placeholder artwork still in use. See public/media/README.md.');
} else {
  say('     ✓ Slot badges off — real photography assumed in place.');
}
say('');

say('  ' + '='.repeat(46));
say(`  ${open} item${open === 1 ? '' : 's'} to confirm before launch.`);
say('');
