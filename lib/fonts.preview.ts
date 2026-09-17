/**
 * Preview-build stand-in for lib/fonts.ts.
 *
 * `next/font` self-hosts its files under /_next and refuses a relative
 * assetPrefix, which the static preview export needs. In preview mode the same
 * two families are loaded from Google Fonts by a <link> in the layout instead,
 * and this module just supplies the class names so nothing else has to change.
 *
 * The server build is unaffected and still self-hosts.
 */
export const display = { variable: 'font-preview-display', className: '' };
export const body = { variable: 'font-preview-body', className: '' };

export const fontVariables = 'font-preview-display font-preview-body';

/** True when this build is the static preview export. */
export const isPreviewFonts = true;
