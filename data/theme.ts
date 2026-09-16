/**
 * BRAND THEME — the single source of truth for Quik Burrito's identity.
 * =====================================================================
 * Colour and type live here and nowhere else. `components/ThemeStyle.tsx`
 * turns this object into the CSS custom properties every stylesheet reads, so
 * changing a value here restyles the entire site.
 *
 * STATUS: NOT YET MATCHED TO THE REAL BRAND.
 * ------------------------------------------------------------------
 * Quik Burrito's logo could not be reached from this build environment
 * (quikburritoaz.com, Instagram and every listing site are blocked by the
 * network egress proxy), so the values below are a warm Arizona/food palette
 * chosen for this site — they are NOT claimed to be Quik Burrito's brand
 * colours. `brandVerified` stays false until someone confirms them.
 *
 * TO MATCH THE REAL BRAND (two minutes):
 *   A. If you have the logo file:
 *        cp your-logo.svg public/media/brand/logo.svg
 *        npm run brand:extract public/media/brand/logo.svg
 *      The script prints the exact palette and the block to paste below.
 *   B. If you have the hex codes, paste them into `colors` directly.
 *   C. For type, see lib/fonts.ts — one edit switches the whole site.
 *
 * Then set `brandVerified: true`.
 */

export const theme = {
  /** Flip to true once the values below are confirmed as the real brand. */
  brandVerified: false,

  colors: {
    /* --- Identity: the colours a customer would name --- */

    /** The dominant brand colour. Drives every primary button and the logo. */
    primary: '#c42b1c',
    /** Hover/active state for primary. A touch brighter, same hue. */
    primaryHot: '#e0402c',
    /** Text/icon colour that sits on `primary`. Must pass contrast. */
    onPrimary: '#ffffff',

    /** Secondary accent — highlights, the kicker line, the map pins. */
    accent: '#ffc24b',
    /** Deeper accent for gradients and hover states. */
    accentDeep: '#f2812c',

    /** Darkest brand neutral. Body text, the footer, deep shadows. */
    ink: '#1a120b',
    /** Softened ink for secondary copy. */
    inkSoft: '#55432f',

    /** Page background. Warm off-white, never pure #fff. */
    paper: '#fff8ed',
    /** Slightly warmer surface for cards sitting on `paper`. */
    surface: '#fff8ed',
  },

  /**
   * Food and Arizona tones used by the cinematic scenes. These are scene art
   * direction, not brand identity — they stay put when the brand colours change.
   */
  scene: {
    masa: '#f6e3c5',
    tortilla: '#e8c89a',
    char: '#1a120b',
    charSoft: '#2a1d12',
    asada: '#7a2e12',
    salsa: '#9b1b10',
    cilantro: '#4f7a3a',
    lime: '#a8c948',
    steel: '#8e9aa3',
    cream: '#fff8ed',
  },

  /** Notes surfaced by `npm run prelaunch`. */
  launchNotes: [
    'Confirm the brand colours against the real Quik Burrito logo, then set brandVerified: true in data/theme.ts.',
    'Confirm the display and body typefaces in lib/fonts.ts against the logo and signage.',
    'Drop the real logo at public/media/brand/logo.svg so the wordmark replaces the text mark.',
  ],
} as const;

export type Theme = typeof theme;
