/**
 * MEDIA CONFIG
 * ============
 * No photograph of Quik Burrito's actual food, kitchen, staff or restaurant was
 * available to this build, and generated food must never be passed off as a
 * photo of a real dish. So every image slot renders an art-directed placeholder
 * until a real asset is dropped in.
 *
 * TO GO LIVE WITH REAL PHOTOGRAPHY:
 *   1. Put the files in /public/media/ (see /public/media/README.md for the
 *      exact filenames each slot expects).
 *   2. Set the matching `image` field in data/menu.ts, or `src` on <FoodPlate>.
 *   3. Flip `showSlotBadges` to false to hide the "photo slot" tags.
 */
export const brandAssets: { logo: string | null; logoLight: string | null } = {
  /**
   * Filename under /public/media/brand/ — e.g. 'logo.svg'.
   * null renders the type-set wordmark instead.
   */
  logo: 'logo.png',
  /** Light-on-dark variant used over the cinematic scenes, e.g. 'logo-light.svg'. */
  logoLight: null,
};

export const mediaConfig = {
  /** Small corner tags marking each empty photo slot. Set false once real photos are in. */
  showSlotBadges: true,
};
