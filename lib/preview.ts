/**
 * Static preview build.
 *
 * The preview is published as a single page, so the multi-route navigation has
 * nowhere to go. In preview mode every internal route is mapped to the matching
 * chapter of the cinematic homepage, which already contains the menu, the
 * reviews and the locations. The server build is untouched and keeps its real
 * routes.
 *
 * NEXT_PUBLIC_PREVIEW is inlined at build time, so this costs nothing at runtime.
 */
export const IS_PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === '1';

const ROUTE_TO_CHAPTER: Record<string, string> = {
  '/': '#opening',
  '/menu': '#signature',
  '/locations': '#locations',
  '/reviews': '#reviews',
  '/about': '#people',
};

/** Maps an internal route to something reachable in the current build. */
export function href(route: string): string {
  if (!IS_PREVIEW) return route;
  if (ROUTE_TO_CHAPTER[route]) return ROUTE_TO_CHAPTER[route];
  // Per-location pages collapse to the locations chapter.
  if (route.startsWith('/locations/')) return '#locations';
  if (route.startsWith('/reviews')) return '#reviews';
  return '#opening';
}
