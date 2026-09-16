/**
 * BRAND TYPOGRAPHY — one edit changes the whole site.
 * ===================================================
 * `--font-display` is the loud one: the logo, headlines, buttons and nav.
 * `--font-body`    is the readable one: descriptions, hours, review text.
 *
 * STATUS: NOT YET MATCHED TO THE REAL BRAND.
 * Quik Burrito's logo and signage could not be reached from this build
 * environment, so the pair below was chosen to suit a bold, fast, local
 * Mexican restaurant — it is not claimed to be their actual typeface.
 *
 * TO SWITCH:
 *   1. Pick a replacement from the table below (or any font on Google Fonts).
 *   2. Change the import and the `display`/`body` consts. That is the only edit
 *      — every stylesheet reads the CSS variables.
 *
 * Only the active pair is imported on purpose: next/font emits @font-face for
 * everything imported, so keeping a shelf of unused fonts here would cost every
 * visitor real download time on a site whose whole job is speed.
 *
 * DISPLAY CANDIDATES
 *   Bebas Neue    condensed all-caps, tall and loud        (active)
 *   Anton         heavier condensed, more weight
 *   Archivo Black very heavy grotesque, wide and modern
 *   Montserrat    (700/800) geometric, the common pick for local brands
 *   Poppins       (700/800) rounder, friendlier, more playful
 *   Fredoka       rounded and fun, good for a casual taqueria
 *
 * BODY CANDIDATES
 *   Inter        neutral, excellent on small screens        (active)
 *   Work Sans    slightly warmer, a little more character
 *   Nunito Sans  rounded, pairs well with a rounded display
 *   Montserrat   if you want a single-family brand
 */

import { Bebas_Neue, Inter } from 'next/font/google';

export const display = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

/** Applied to <html> by the root layout. */
export const fontVariables = `${display.variable} ${body.variable}`;
