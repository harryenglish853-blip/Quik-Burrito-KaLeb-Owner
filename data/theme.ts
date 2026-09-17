/**
 * BRAND THEME — the single source of truth for Quik Burrito's identity.
 * =====================================================================
 * Colour and type live here and nowhere else. `components/ThemeStyle.tsx`
 * turns this object into the CSS custom properties every stylesheet reads, so
 * changing a value here restyles the entire site.
 *
 * STATUS: MATCHED TO THE REAL LOGO.
 * ------------------------------------------------------------------
 * Colours below were read out of Quik Burrito's own badge logo with
 * `npm run brand:extract public/media/brand/logo.png`:
 *
 *     #000000  black      the badge field                    (17.6% coverage)
 *     #FFFFFF  white      the inner ring, PHX / AZ, the foil  (13.3%)
 *     #FDFD00  yellow     the outer ring, glow, underlines    (8.3%)
 *
 * It is a three-colour badge brand, so the site is too. Yellow carries the
 * primary action, black carries the brand surfaces, white carries the type.
 *
 * Contrast: black on yellow is 19.2:1 and white on black is 21:1, both far
 * past WCAG AAA. Yellow is never used for text on white — at 1.07:1 it would
 * be invisible — only as a field behind black type, or as type on black.
 */

export const theme = {
  /** Flip to true once the values below are confirmed as the real brand. */
  brandVerified: true,

  colors: {
    /* --- Identity: straight off the badge --- */

    /** The brand yellow. Carries every primary action. */
    primary: '#fdfd00',
    /** Hover/active. Brighter, same hue. */
    primaryHot: '#ffff4d',
    /** Type on yellow. Black, as on the badge — 19.2:1. */
    onPrimary: '#000000',

    /** Accent is the same yellow: rules, kickers, the underline device. */
    accent: '#fdfd00',
    /** Deeper yellow for gradients and pressed states. */
    accentDeep: '#c9c900',

    /** The badge field. Brand surfaces, the footer, the cinematic scenes. */
    ink: '#0b0b0b',
    /** Softened ink for secondary copy on white. */
    inkSoft: '#4a4a4a',

    /** Utility pages stay white so the food and the menu can breathe. */
    paper: '#ffffff',
    surface: '#ffffff',
  },

  /**
   * Food and Arizona tones used by the cinematic scenes. These are scene art
   * direction, not brand identity — they stay put when the brand colours change.
   */
  scene: {
    masa: '#f6e3c5',
    tortilla: '#e8c89a',
    char: '#000000',
    charSoft: '#141414',
    asada: '#7a2e12',
    salsa: '#9b1b10',
    cilantro: '#4f7a3a',
    lime: '#a8c948',
    steel: '#8e9aa3',
    cream: '#ffffff',
  },

  /** Notes surfaced by `npm run prelaunch`. */
  launchNotes: [
    'Logo supplied as a raster badge (public/media/brand/logo.png). Ask for the vector original (SVG/AI/EPS) so it stays crisp at any size.',
    'A white/knockout version of the badge would let it sit on black without its own ring — optional.',
  ],
} as const;

export type Theme = typeof theme;
