/**
 * BRAND CONSTANTS
 * ===============
 * Campaign copy below was written for this site. It is NOT presented anywhere
 * as an existing official Quik Burrito slogan, and is marked as replaceable.
 */

export const brand = {
  name: 'Quik Burrito',
  legalName: 'Quik Burrito',
  region: 'Arizona',
  cuisine: ['Mexican', 'Burritos', 'Breakfast Burritos', 'Birria', 'Tacos'],

  /** Campaign copy authored for this site — swap freely. */
  campaign: {
    headline: ['Big flavor.', 'Made quik.'],
    ingredients: ['Fresh.', 'Bold.', 'Quik.'],
    kitchen: ['Made fresh.', 'Built with flavor.'],
    build: ['Built fresh.', 'Wrapped quik.'],
    birria: 'Dip into something better.',
    breakfast: "Breakfast doesn't have to be boring.",
    day: ['When the craving hits.', 'Quik Burrito.'],
    people: ['Good food.', 'Good people.', 'Quik.'],
    finale: ['Hungry yet?', 'Order quik.'],
    closing: 'What are you waiting for?',
    experience: ['Quick enough for lunch.', 'Good enough to crave tomorrow.'],
  },

  social: {
    instagram: {
      handle: '@quikburrito',
      url: 'https://www.instagram.com/quikburrito/',
        featuredReelUrl: 'https://www.instagram.com/reel/DVeVnssEoPv/',
    },
    /* Real profile, kept for reference. Deliberately NOT surfaced on the site
       and not listed in structured data: reviews are confined to Google, Yelp
       and this site, and a Facebook page carries its own Recommendations. */
    facebook: 'https://www.facebook.com/p/Quik-Burrito-61556653532092/',
  },

  website: 'https://www.quikburritoaz.com/',

  /** Studio credit shown in the footer. */
  credit: {
    label: 'Noir Echelon',
    url: 'https://www.noirechelon.tech/',
  },

  /**
   * Verified facts, each with a source. Anything not listed here is not claimed
   * on the site — no founding date, no store count, no awards, no "never frozen",
   * no "locally sourced", no "made from scratch".
   */
  facts: [
    {
      claim: 'Family-run, owned by Arizonans.',
      source: 'https://www.quikburritoaz.com/',
      note: 'Publicly described as a locally born-and-raised brother-and-sister operation.',
    },
    {
      claim: 'Birria tacos are served with consommé for dipping.',
      source: 'https://quik-burrito-anthem.res-menu.net/',
    },
  ],

  /** Claims explicitly NOT made anywhere on this site. Keep this list honest. */
  disallowedClaims: [
    'organic',
    'farm-to-table',
    'all-natural',
    'locally sourced',
    'never frozen',
    'made entirely from scratch',
    'award-winning',
    'late-night hours',
    'number of locations opened / founding year',
  ],
} as const;

/** Colors distilled from Quik Burrito's food and Arizona setting. */
export const palette = {
  masa: '#F6E3C5',
  tortilla: '#E8C89A',
  char: '#1A120B',
  asada: '#7A2E12',
  chile: '#C42B1C',
  salsaRoja: '#9B1B10',
  sunset: '#F2812C',
  sunAZ: '#FFC24B',
  cilantro: '#4F7A3A',
  lime: '#A8C948',
  steel: '#8E9AA3',
  cream: '#FFF8ED',
} as const;
