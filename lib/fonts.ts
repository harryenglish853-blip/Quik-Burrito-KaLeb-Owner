/**
 * BRAND TYPOGRAPHY — one edit changes the whole site.
 * ===================================================
 * `--font-display` is the loud one: the logo, headlines, buttons and nav.
 * `--font-body`    is the readable one: descriptions, hours, review text.
 *
 * STATUS: MATCHED TO THE LOGO.
 * The PHX / AZ lettering on the badge is a heavy, slightly wide grotesque with
 * flat terminals and a pointed A apex. Archivo Black is the closest match
 * available on Google Fonts. (Bebas Neue, used before the logo arrived, is far
 * more condensed and was not it.)
 *
 * If the badge was set in a licensed typeface, send the files and it can be
 * self-hosted instead — that is a change to this file only.
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
 *   Archivo Black very heavy grotesque, wide and modern      (active)
 *   Anton         heavier condensed, much narrower
 *   Bebas Neue    condensed all-caps, tall and loud
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

import { Archivo_Black, Inter } from 'next/font/google';

export const display = Archivo_Black({
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
