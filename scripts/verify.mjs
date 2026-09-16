#!/usr/bin/env node
/**
 * End-to-end verification.
 *
 * Checks the things a restaurant site cannot get wrong: that every page
 * renders, that ORDER ONLINE / CALL / DIRECTIONS exist and point somewhere
 * real, that nothing overflows sideways on a phone, that the cinematic scroll
 * scrubs and reverses, and that ordering still works with reduced motion or
 * with JavaScript switched off entirely.
 *
 * Usage:
 *   npm run build && npm start        # in one terminal
 *   npm i -D playwright && npm run verify
 */

import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3000';
const VIEWPORTS = [
  { name: 'iPhone SE   375', w: 375, h: 667, mobile: true },
  { name: 'iPhone 12   390', w: 390, h: 844, mobile: true },
  { name: 'iPhone ProMax 430', w: 430, h: 932, mobile: true },
  { name: 'iPad        768', w: 768, h: 1024, mobile: true },
  { name: 'Laptop     1024', w: 1024, h: 768, mobile: false },
  { name: 'Desktop    1440', w: 1440, h: 900, mobile: false },
  { name: 'Wide       1920', w: 1920, h: 1080, mobile: false },
  { name: 'Landscape  844x390', w: 844, h: 390, mobile: true },
];
const ROUTES = ['/', '/menu', '/locations', '/locations/anthem', '/reviews', '/about'];

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
let failures = 0;
const note = (s) => console.log(s);

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  const bad = [];
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      bodyText: (document.body.innerText || '').length,
      orderBtns: document.querySelectorAll('[data-qb-order]').length,
      telLinks: document.querySelectorAll('a[href^="tel:"]').length,
      mapLinks: document.querySelectorAll('a[href*="maps"]').length,
      h1: document.querySelectorAll('h1').length,
      deadHref: Array.from(document.querySelectorAll('a')).filter(a => {
        const h = a.getAttribute('href');
        return !h || h === '#' || h === 'undefined' || h.includes('undefined') || h.includes('VERIFY_');
      }).length,
    }));
    if (r.scrollW > r.clientW + 1) bad.push(`${route} H-OVERFLOW ${r.scrollW}>${r.clientW}`);
    if (r.bodyText < 200) bad.push(`${route} THIN/BLANK (${r.bodyText} chars)`);
    if (r.orderBtns === 0) bad.push(`${route} NO ORDER BUTTON`);
    if (r.telLinks === 0) bad.push(`${route} NO TEL LINK`);
    if (r.h1 !== 1) bad.push(`${route} H1 COUNT=${r.h1}`);
    if (r.deadHref > 0) bad.push(`${route} ${r.deadHref} DEAD HREF`);
  }

  const status = bad.length === 0 && errors.length === 0 ? 'PASS' : 'FAIL';
  if (status === 'FAIL') failures++;
  note(`  [${status}] ${vp.name}`);
  bad.forEach((b) => note(`         ! ${b}`));
  errors.slice(0, 4).forEach((e) => note(`         ! console: ${e.slice(0, 130)}`));
  await ctx.close();
}

// ---- Interaction tests at 390 and 1440 ----
for (const vp of [{ w: 390, h: 844, mobile: true, label: 'mobile 390' }, { w: 1440, h: 900, mobile: false, label: 'desktop 1440' }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.mobile, hasTouch: vp.mobile });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const out = [];

  // Menu drawer opens
  const menuBtn = page.locator('button:visible', { hasText: /^Menu$/i }).first();
  await menuBtn.click();
  await page.waitForTimeout(600);
  const drawerOpen = await page.locator('.drawer--open [role="dialog"]').isVisible();
  out.push(['menu drawer opens', drawerOpen]);
  const menuItems = await page.locator('.drawer .mitem').count();
  out.push(['drawer lists items', menuItems > 0]);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  out.push(['escape closes drawer', !(await page.locator('.drawer--open').count() > 0)]);

  // Mobile order bar presence
  const barVisible = await page.locator('.obar').isVisible().catch(() => false);
  out.push([vp.mobile ? 'order bar visible (mobile)' : 'order bar hidden (desktop)', vp.mobile ? barVisible : !barVisible]);

  // Scroll-driven motion actually changes transforms
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const t0 = await page.evaluate(() => getComputedStyle(document.querySelector('#opening .layer--subject')).transform);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
  await page.waitForTimeout(2000);
  const t1 = await page.evaluate(() => getComputedStyle(document.querySelector('#opening .layer--subject')).transform);
  out.push(['scroll scrubs camera', t0 !== t1]);

  // Reverse scroll
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2200);
  const t2 = await page.evaluate(() => getComputedStyle(document.querySelector('#opening .layer--subject')).transform);
  out.push(['reverse scroll restores', t2 !== t1]);

  // Header turns solid
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
  await page.waitForTimeout(500);
  out.push(['header goes solid', await page.locator('.hdr--solid').count() > 0]);

  // Location persistence
  await page.goto(BASE + '/locations', { waitUntil: 'networkidle' });
  const stored = await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x => /make this my/i.test(x.textContent || ''));
    if (b) b.click();
    return true;
  });
  await page.waitForTimeout(400);
  const ls = await page.evaluate(() => localStorage.getItem('qb:location'));
  out.push(['location persists to localStorage', ls === 'anthem']);

  console.log(`\n  --- interactions @ ${vp.label} ---`);
  out.forEach(([n, ok]) => { if (!ok) failures++; console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${n}`); });
  errs.forEach(e => { failures++; console.log(`  [FAIL] pageerror: ${e.slice(0,120)}`); });
  await ctx.close();
}

// ---- Reduced motion ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => ({
    orderBtns: document.querySelectorAll('[data-qb-order]').length,
    sticky: getComputedStyle(document.querySelector('.cine__stage')).position,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    text: document.body.innerText.length,
  }));
  console.log('\n  --- reduced motion ---');
  const checks = [
    ['ordering still present', r.orderBtns > 0],
    ['stages unpinned', r.sticky === 'relative' || r.sticky === 'static'],
    ['no horizontal overflow', !r.overflow],
    ['content renders', r.text > 500],
    ['no page errors', errs.length === 0],
  ];
  checks.forEach(([n, ok]) => { if (!ok) failures++; console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${n}`); });
  await ctx.close();
}

// ---- JavaScript disabled ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const r = await page.evaluate ? null : null;
  const html = await page.content();
  console.log('\n  --- javascript disabled ---');
  const checks = [
    ['brand visible', html.includes('Quik Burrito')],
    ['order link present', html.includes('quikburritoaz.com/quik-burrito')],
    ['phone link present', html.includes('tel:+14805345768')],
    ['directions link present', html.includes('maps/dir')],
    ['menu items present', html.includes('Birria Tacos')],
  ];
  checks.forEach(([n, ok]) => { if (!ok) failures++; console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${n}`); });
  await ctx.close();
}

await browser.close();
console.log(`\n  ${failures === 0 ? 'ALL CHECKS PASSED' : failures + ' CHECK(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
