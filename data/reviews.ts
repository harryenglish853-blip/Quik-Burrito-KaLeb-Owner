/**
 * CUSTOMER REVIEWS
 * ================
 * HARD RULE: every entry in `reviews` must be a real, publicly posted review
 * that Quik Burrito is permitted to display. No invented names. No invented
 * ratings. No invented counts. No paraphrasing a real review into a nicer one.
 *
 * This array ships EMPTY on purpose.
 *
 * Real quotes do exist publicly (Yelp, Tripadvisor, Facebook, Nextdoor), but a
 * reviewer's display name, exact wording and date could not be captured from an
 * authoritative source during the build, and attributing a quote to a made-up
 * name is exactly the failure mode this file exists to prevent.
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
 * to the live review pages. Fewer real reviews beat many fake ones.
 */

export type ReviewSourceName = 'Google' | 'Yelp' | 'Tripadvisor' | 'Facebook' | 'Nextdoor';

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

/** Live review destinations. These are real pages — used for "READ MORE REVIEWS". */
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
    source: 'Yelp',
    url: 'https://www.yelp.com/biz/quik-burrito-anthem-2',
    label: 'Reviews and photos for the Anthem store',
  },
  {
    locationId: 'anthem',
    source: 'Facebook',
    url: 'https://www.facebook.com/p/Quik-Burrito-61556653532092/',
    label: 'Posts and recommendations',
  },
  {
    locationId: 'anthem',
    source: 'Nextdoor',
    url: 'https://nextdoor.com/pages/quik-burrito-phoenix-az/',
    label: 'What neighbors are saying',
  },
  {
    locationId: 'anthem',
    source: 'Tripadvisor',
    url: 'https://www.tripadvisor.com/Restaurant_Review-g31310-d27902213-Reviews-Quik_Burrito-Phoenix_Arizona.html',
    label: 'Traveler reviews',
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
