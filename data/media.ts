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

/**
 * FOOD PHOTOGRAPHY REGISTRY
 * =========================
 * Every photo the site shows of food, with where it came from. `provenance` is
 * the field that matters:
 *
 *   'restaurant'     a photo of Quik Burrito's own food, supplied by them.
 *   'representative' a dish photo that is NOT their plate — accurate to what
 *                    the item is, but not a record of their kitchen.
 *   'unconfirmed'    supplied, but nobody has yet said which of the two it is.
 *
 * Anything left 'unconfirmed' is reported by `npm run prelaunch`. A photo that
 * is not theirs must not be captioned or described as if it were.
 */
export type FoodPhoto = {
  /** Path under /public/media. */
  file: string;
  /** Truthful description of what the photograph shows. */
  alt: string;
  provenance: 'restaurant' | 'representative' | 'unconfirmed';
  note?: string;
};

export const foodPhotos: Record<string, FoodPhoto> = {
  birria: {
    file: 'food/birria-tacos.webp',
    alt: 'Birria tacos on a clay plate, cheese pulling from the fold, with a bowl of consommé alongside',
    provenance: 'unconfirmed',
    note: 'Supplied by the owner during the build. Confirm whether this is a photo of Quik Burrito\'s own birria tacos or a representative dish shot — the site should not imply the first if it is the second.',
  },
};

export const mediaConfig = {
  /** Small corner tags marking each empty photo slot. Set false once real photos are in. */
  showSlotBadges: true,
};
