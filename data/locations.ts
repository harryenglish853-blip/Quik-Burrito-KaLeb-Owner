import { Verifiable, verified, unverified, show } from './verification';

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type Hours = Record<DayKey, { open: string; close: string } | null>;

export type DeliveryPartner = {
  name: string;
  url: string;
};

export type Location = {
  id: string;
  /** URL slug for /locations/[slug] */
  slug: string;
  name: string;
  /** Short label used in the location switcher. */
  shortName: string;
  status: 'open' | 'closed';
  /** Only rendered when status === 'open'. */
  address: Verifiable<{
    street: string;
    city: string;
    state: string;
    zip: string;
  }>;
  phone: Verifiable<string>;
  hours: Verifiable<Hours>;
  /** Restaurant's own online ordering. Never invent this. */
  orderUrl: Verifiable<string>;
  /** True once the link is confirmed to open THIS location's ordering flow. */
  orderUrlIsLocationSpecific: boolean;
  menuUrl: Verifiable<string>;
  mapsUrl: Verifiable<string>;
  reviewUrl: Verifiable<string>;
  coordinates: Verifiable<{ lat: number; lng: number }>;
  /** Third-party delivery, shown as secondary options only. */
  delivery: DeliveryPartner[];
  /** Notes surfaced in the pre-launch report. */
  launchNotes: string[];
};

const SRC_YELP_ANTHEM = 'https://www.yelp.com/biz/quik-burrito-anthem-2';
/** Confirmed directly by the owner. */
const SRC_OWNER = 'Confirmed by the owner';
/** Yelp link as supplied by the owner. */
const YELP_ANTHEM_SHORT = 'https://yelp.to/6GGDkM9gZm';
const SRC_APPLE_MAPS_ANTHEM = 'https://maps.apple.com/place?place-id=IBC134F06F8199029';
const SRC_OFFICIAL = 'https://www.quikburritoaz.com/';

export const locations: Location[] = [
  {
    id: 'anthem',
    slug: 'anthem',
    name: 'Quik Burrito — Anthem',
    shortName: 'Anthem',
    status: 'open',
    address: verified(
      { street: '3434 W Anthem Way', city: 'Anthem', state: 'AZ', zip: '85086' },
      SRC_OWNER,
      'Confirmed by the owner, and matches the public Yelp listing.',
    ),
    phone: verified('+14805345768', SRC_YELP_ANTHEM),
    hours: verified(
      {
        mon: { open: '08:00', close: '20:00' },
        tue: { open: '08:00', close: '20:00' },
        wed: { open: '08:00', close: '20:00' },
        thu: { open: '08:00', close: '20:00' },
        fri: { open: '08:00', close: '21:00' },
        sat: { open: '08:00', close: '21:00' },
        sun: { open: '08:00', close: '16:00' },
      },
      SRC_APPLE_MAPS_ANTHEM,
      'Public map listing. Confirm against the in-store sign before launch — holiday hours are not represented here.',
    ),
    orderUrl: verified(
      'https://www.quikburritoaz.com/quik-burrito/',
      SRC_OFFICIAL,
      "Quik Burrito's own ordering + locations page.",
    ),
    orderUrlIsLocationSpecific: false,
    menuUrl: verified('https://www.quikburritoaz.com/', SRC_OFFICIAL),
    mapsUrl: verified(
      'https://www.google.com/maps/dir/?api=1&destination=' +
        encodeURIComponent('Quik Burrito, 3434 W Anthem Way, Anthem, AZ 85086'),
      SRC_OWNER,
      'Address-based directions link — resolves correctly without hardcoded coordinates.',
    ),
    reviewUrl: verified(YELP_ANTHEM_SHORT, SRC_OWNER),
    coordinates: unverified(
      'No authoritative lat/lng obtained. Directions use the full address instead, which is accurate. ' +
        'Add coordinates from Google Business Profile to enrich structured data.',
    ),
    delivery: [
      {
        name: 'DoorDash',
        url: 'https://www.doordash.com/store/quik-burrito-anthem-35871573/',
      },
    ],
    launchNotes: [
      'Confirm the ORDER ONLINE link lands on the Anthem ordering flow. If Quik Burrito has a per-location deep link, replace `orderUrl` and set `orderUrlIsLocationSpecific: true`.',
      'Confirm current hours, including holiday hours.',
      'Add latitude/longitude from the Google Business Profile to complete structured data.',
    ],
  },
];

/**
 * Locations recorded as CLOSED on public listings. Kept here deliberately so
 * they are never re-added by mistake, and so the site never sends a hungry
 * customer to a door that does not open. These are NOT rendered anywhere.
 */
export const closedLocations = [
  { name: '3131 E Thunderbird Rd, Phoenix, AZ', source: 'https://www.yelp.com/biz/quik-burrito-phoenix-2' },
  { name: '4825 E Warner Rd, Phoenix, AZ', source: 'https://www.yelp.com/biz/quik-burrito-phoenix-3' },
  { name: '1810 W Northern Ave, Phoenix, AZ', source: 'https://www.yelp.com/biz/quik-burrito-phoenix-4' },
];

export const openLocations = locations.filter((l) => l.status === 'open');

export const defaultLocation = openLocations[0];

export function getLocation(slug: string): Location | undefined {
  return openLocations.find((l) => l.slug === slug);
}

/* ---------- display helpers (single source of truth for formatting) ---------- */

export function formatAddress(loc: Location): string | null {
  const a = show(loc.address);
  if (!a) return null;
  return `${a.street}, ${a.city}, ${a.state} ${a.zip}`;
}

export function formatPhone(loc: Location): string | null {
  const p = show(loc.phone);
  if (!p) return null;
  const digits = p.replace(/\D/g, '').replace(/^1/, '');
  if (digits.length !== 10) return p;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function telHref(loc: Location): string | null {
  const p = show(loc.phone);
  return p ? `tel:${p}` : null;
}

export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export const DAY_ORDER: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, '0')}${suffix}`;
}

/** Groups consecutive identical days: "Mon–Thu 8am–8pm". */
export function summarizeHours(hours: Hours): { days: string; time: string }[] {
  const rows: { days: string; time: string }[] = [];
  let runStart = 0;

  const key = (d: DayKey) => {
    const h = hours[d];
    return h ? `${h.open}-${h.close}` : 'closed';
  };

  for (let i = 0; i <= DAY_ORDER.length; i++) {
    const same = i < DAY_ORDER.length && key(DAY_ORDER[i]) === key(DAY_ORDER[runStart]);
    if (!same) {
      const start = DAY_ORDER[runStart];
      const end = DAY_ORDER[i - 1];
      const h = hours[start];
      const label =
        runStart === i - 1
          ? DAY_LABELS[start].slice(0, 3)
          : `${DAY_LABELS[start].slice(0, 3)}–${DAY_LABELS[end].slice(0, 3)}`;
      rows.push({
        days: label,
        time: h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : 'Closed',
      });
      runStart = i;
    }
  }
  return rows;
}

/** Schema.org openingHours strings, e.g. "Mo-Th 08:00-20:00". */
export function schemaOpeningHours(hours: Hours): string[] {
  const schemaDay: Record<DayKey, string> = {
    mon: 'Mo', tue: 'Tu', wed: 'We', thu: 'Th', fri: 'Fr', sat: 'Sa', sun: 'Su',
  };
  return DAY_ORDER.flatMap((d) => {
    const h = hours[d];
    return h ? [`${schemaDay[d]} ${h.open}-${h.close}`] : [];
  });
}
