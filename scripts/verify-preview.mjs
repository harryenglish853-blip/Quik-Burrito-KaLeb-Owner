#!/usr/bin/env node
/**
 * Verifies the static preview export the way a visitor meets it: served from a
 * subdirectory, with every image, request and link checked.
 *
 * This exists because a root-absolute image path shipped once and 404'd
 * silently — the page looked fine in the server build and was broken in the
 * export. A rendered <img> is only counted as working if it actually decoded.
 *
 * Usage:  BASE=http://127.0.0.1:8099/qb-preview node scripts/verify-preview.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:8099/qb-preview';
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

let failures = 0;
const say = (s) => console.log(s);
const fail = (s) => { failures++; console.log('  [FAIL] ' + s); };
const pass = (s) => console.log('  [PASS] ' + s);

const VIEWPORTS = [
  { name: 'phone   390', w: 390, h: 844, mobile: true },
  { name: 'tablet  768', w: 768, h: 1024, mobile: true },
  { name: 'desktop 1440', w: 1440, h: 900, mobile: false },
];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await ctx.newPage();
  const bad = [];
  page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
  page.on('pageerror', (e) => bad.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') bad.push('console: ' + m.text()); });

  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Scroll the whole page so every lazy image is asked for.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);

  const r = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('img')];
    return {
      imgTotal: imgs.length,
      imgBroken: imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src')),
      imgNoAlt: imgs.filter((i) => i.getAttribute('alt') === null).map((i) => i.getAttribute('src')),
      order: document.querySelectorAll('[data-qb-order]').length,
      tel: document.querySelectorAll('a[href^="tel:"]').length,
      maps: document.querySelectorAll('a[href*="maps"]').length,
      deadHref: [...document.querySelectorAll('a')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => !h || h === '#' || h.includes('undefined') || h.includes('VERIFY_')),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      text: document.body.innerText.length,
    };
  });

  say(`\n  --- ${vp.name} ---`);
  r.imgBroken.length ? fail(`broken images: ${r.imgBroken.join(', ')}`) : pass(`all ${r.imgTotal} images decoded`);
  r.imgNoAlt.length ? fail(`images missing alt: ${r.imgNoAlt.join(', ')}`) : pass('every image has alt text');
  r.order > 0 ? pass(`${r.order} order buttons`) : fail('no order button');
  r.tel > 0 ? pass(`${r.tel} phone links`) : fail('no phone link');
  r.maps > 0 ? pass(`${r.maps} directions links`) : fail('no directions link');
  r.deadHref.length ? fail(`dead links: ${r.deadHref.join(', ')}`) : pass('no dead links');
  r.overflow ? fail('horizontal overflow') : pass('no horizontal overflow');
  r.text > 2000 ? pass('content renders') : fail(`thin content (${r.text} chars)`);
  bad.length ? fail(`requests/errors: ${[...new Set(bad)].slice(0, 6).join(' | ')}`) : pass('no failed requests or console errors');

  await ctx.close();
}

await browser.close();
say(`\n  ${failures === 0 ? 'PREVIEW OK' : failures + ' CHECK(S) FAILED'}\n`);
process.exit(failures === 0 ? 0 : 1);
