#!/usr/bin/env node
/**
 * Builds the static preview export into ./out.
 *
 * `next/font` self-hosts its files under /_next and refuses the relative
 * assetPrefix the preview needs, and a webpack alias does not help because Next
 * resolves the font module before user aliases apply. So for the duration of
 * this build only, lib/fonts.ts is swapped for lib/fonts.preview.ts, which
 * loads the same two families from Google Fonts via a <link> in the layout.
 *
 * The original file is always restored, including on failure.
 */
import { copyFileSync, renameSync, existsSync, rmSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const REAL = 'lib/fonts.ts';
const PREVIEW = 'lib/fonts.preview.ts';
const BACKUP = 'lib/fonts.server.bak';

if (!existsSync(REAL) || !existsSync(PREVIEW)) {
  console.error('Expected both lib/fonts.ts and lib/fonts.preview.ts to exist.');
  process.exit(1);
}

let swapped = false;
try {
  renameSync(REAL, BACKUP);
  copyFileSync(PREVIEW, REAL);
  swapped = true;

  rmSync('out', { recursive: true, force: true });
  rmSync('.next', { recursive: true, force: true });

  const res = spawnSync('npx', ['next', 'build'], {
    stdio: 'inherit',
    env: { ...process.env, PREVIEW: '1', NEXT_PUBLIC_PREVIEW: '1' },
  });
  if (res.status !== 0) {
    process.exitCode = res.status ?? 1;
  } else {
    makeRootRefsRelative('out');
    renameAssetDir('out');
    assertNoRootAbsoluteAssets('out');
  }
} finally {
  if (swapped) {
    rmSync(REAL, { force: true });
    renameSync(BACKUP, REAL);
  }
  /**
   * Clear .next on the way out.
   *
   * The preview shares .next with the server build but compiles with a relative
   * assetPrefix. Leaving it behind meant a later `npm start` served the preview
   * as if it were production: `./_next/...` resolves at / and /menu but 404s
   * from a nested route like /locations/anthem, so that page rendered with no
   * stylesheet at all. Removing it makes `npm start` fail loudly with "no
   * production build found" instead of serving a subtly broken site.
   */
  rmSync('.next', { recursive: true, force: true });
}


/**
 * Next writes the favicon link as an absolute /icon.svg. The preview is served
 * from a subdirectory, so root-absolute asset URLs would 404. These references
 * live in server-rendered <head> metadata that React never re-renders on the
 * client, so rewriting them in the emitted HTML holds after hydration.
 */
function makeRootRefsRelative(dir) {
  let touched = 0;
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.html')) {
        const depth = full.split('/').length - dir.split('/').length - 1;
        const up = depth > 0 ? '../'.repeat(depth) : '';
        const src = readFileSync(full, 'utf8');
        const out = src.replaceAll('href="/icon.svg', `href="${up}icon.svg`);
        if (out !== src) {
          writeFileSync(full, out);
          touched++;
        }
      }
    }
  };
  walk(dir);
  console.log(`\n  Rewrote root-absolute asset refs in ${touched} page(s).`);
}


/**
 * The artifact host reserves published paths beginning with "_", which is
 * exactly where Next puts its build output. Rename the directory and rewrite
 * the references to it.
 *
 * Every reference in the export is the single form `./_next/` — in the HTML and
 * in the webpack runtime's publicPath — so this is a targeted replace. The
 * `__next_f` style identifiers in the bundles contain no slash and are left
 * alone.
 */
function renameAssetDir(dir) {
  const FROM = './_next/';
  const TO = './qb-assets/';
  let touched = 0;

  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(html|js|css|txt|json)$/.test(entry)) continue;
      const src = readFileSync(full, 'utf8');
      if (!src.includes(FROM)) continue;
      writeFileSync(full, src.replaceAll(FROM, TO));
      touched++;
    }
  };
  walk(dir);

  const oldDir = join(dir, '_next');
  const newDir = join(dir, 'qb-assets');
  if (existsSync(oldDir)) {
    rmSync(newDir, { recursive: true, force: true });
    renameSync(oldDir, newDir);
  }
  console.log(`  Renamed _next -> qb-assets and rewrote ${touched} file(s).`);
}


/**
 * Fails the build if any root-absolute asset URL survives into the export.
 *
 * The preview is served from a subdirectory, so a leading slash points at the
 * wrong host root and the asset 404s silently — which is exactly how a broken
 * image shipped once. Checks rendered attributes only; absolute paths inside
 * the RSC payload are metadata, not fetches.
 */
function assertNoRootAbsoluteAssets(dir) {
  const offenders = [];
  const attr = /(?:src|href)="(\/[^"/][^"]*)"/g;

  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (entry.endsWith('.html')) {
        const src = readFileSync(full, 'utf8');
        for (const m of src.matchAll(attr)) offenders.push(`${full}  ${m[1]}`);
      }
    }
  };
  walk(dir);

  if (offenders.length) {
    console.error('\n  Root-absolute asset paths would 404 in the preview:\n');
    for (const o of [...new Set(offenders)]) console.error('    ' + o);
    console.error('\n  Route them through mediaUrl() in lib/preview.ts.\n');
    process.exit(1);
  }
  console.log('  No root-absolute asset paths. \u2713');
}
