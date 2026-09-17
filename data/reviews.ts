/**
 * CUSTOMER REVIEWS
 * ================
 * HARD RULE: every entry in `reviews` must be a real, publicly posted review
 * that Quik Burrito is permitted to display. No invented names. No invented
 * ratings. No invented counts. No paraphrasing a real review into a nicer one.
 *
 * This array ships EMPTY on purpose.
 *
 * Real quotes do exist publicly, but a reviewer's display name, exact wording
 * and date could not be captured from an authoritative source during the build,
 * and attributing a quote to a made-up name is exactly the failure mode this
 * file exists to prevent.
 *
 * TO POPULATE (5 minutes, one time):
 *   1. Open the location's review page — see `reviewSources` below.
 *   2. For each review you want to feature, copy the reviewer's PUBLIC display
 *      name, the rating, the text VERBATIM, and the date.
 *   3. Push an object into `reviews`. Set `locationId` to the store the review
 *      actually belongs to — reviews are never pooled across locations.
 *   4. Confirm you have the right to republish it (Yelp and Google both require
 *      attribution and a link back; `sourceUrl` handles that).
 *
 * Until then the site shows a real, honest panel that links customers straight
 * to Google and Yelp. Fewer real reviews beat many fake ones.
 *
 * Reviews appear in three places and nowhere else: Google, Yelp, and quoted on
 * this site from the array below.
 */

/**
 * Reviews live in exactly two places off-site — Google and Yelp — plus whatever
 * is quoted on this site itself. Set by the owner; do not widen it. Tripadvisor,
 * Facebook and Nextdoor were removed for that reason, not because they had no
 * content.
 */
export type ReviewSourceName = 'Google' | 'Yelp';

export type Review = {
  /** Must match a Location.id — reviews are never shown under the wrong store. */
  locationId: string;
  /** The reviewer's public display name, exactly as published. */
  reviewer: string;
  source: ReviewSourceName;
  /** 1–5, only when the source actually shows one. */
  rating: number | null;
  /** Verbatim review text. Never edited for tone or length beyond a trailing "…". */
  text: string;
  /** ISO date (YYYY-MM-DD) when published, or null if the source hides it. */
  date: string | null;
  sourceUrl: string;
};

export const reviews: Review[] = [
  // Intentionally empty. See the header above before adding anything.
];

/**
 * Live review destinations. Real pages, used for "READ MORE REVIEWS".
 * Google and Yelp only — see ReviewSourceName.
 */
export type ReviewSource = {
  locationId: string;
  source: ReviewSourceName;
  url: string;
  /** What a customer will find there. No rating or count is claimed here,
   *  because star averages and review counts change daily and must not be frozen
   *  into the page as if they were facts. */
  label: string;
};

export const reviewSources: ReviewSource[] = [
  {
    locationId: 'anthem',
    source: 'Google',
    // Resolves to the Google listing for the confirmed address, where the
    // reviews and the star average live. Swap in the Business Profile's direct
    // place link if you want to skip the lookup hop.
    url:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Quik Burrito, 3434 W Anthem Way, Anthem, AZ 85086'),
    label: 'Reviews on Google',
  },
  {
    locationId: 'anthem',
    source: 'Yelp',
    // Supplied by the owner. Canonical long form is
    // https://www.yelp.com/biz/quik-burrito-anthem-2 — swap it in if this short
    // link is ever retired.
    url: 'https://yelp.to/6GGDkM9gZm',
    label: 'Reviews on Yelp',
  },
];

export function reviewsFor(locationId: string): Review[] {
  return reviews.filter((r) => r.locationId === locationId);
}

export function reviewSourcesFor(locationId: string): ReviewSource[] {
  return reviewSources.filter((r) => r.locationId === locationId);
}

/**
 * Aggregate rating for structured data.
 * Returns null unless there are enough real, rated reviews to compute one
 * honestly — Google penalises invented aggregate ratings, and so should we.
 */
export function aggregateRating(locationId: string): { value: number; count: number } | null {
  const rated = reviewsFor(locationId).filter((r) => typeof r.rating === 'number');
  if (rated.length === 0) return null;
  const sum = rated.reduce((acc, r) => acc + (r.rating as number), 0);
  return { value: Math.round((sum / rated.length) * 10) / 10, count: rated.length };
}
