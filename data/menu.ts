/**
 * MENU DATA
 * =========
 * Item names and descriptions below are drawn from Quik Burrito's publicly
 * listed menu. Nothing here is invented.
 *
 * PRICES ARE DELIBERATELY ABSENT.
 * The only prices found publicly were on third-party delivery platforms, which
 * are routinely marked up above in-store pricing. Publishing those as Quik
 * Burrito's prices would be inaccurate, so every item carries `price: null` and
 * the UI routes customers to live ordering for current pricing instead.
 * To add real prices, fill `price` with the in-store figure and nothing else.
 */

export type MenuItem = {
  id: string;
  name: string;
  /** Verified public description, or null when none was confirmed. */
  description: string | null;
  /** In-store price. null = not verified; the UI shows no price at all. */
  price: number | null;
  /** Drop a real photo at /public/media/menu/{image} to replace the placeholder. */
  image: string | null;
  /** Visual tone used by the placeholder renderer until a real photo exists. */
  tone: FoodTone;
  /** false = hidden everywhere until confirmed. */
  verified: boolean;
  note?: string;
};

export type FoodTone =
  | 'tortilla'
  | 'asada'
  | 'birria'
  | 'breakfast'
  | 'salsa'
  | 'cheese'
  | 'fries'
  | 'greens';

export type MenuCategory = {
  id: string;
  name: string;
  blurb: string | null;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: 'signature-burritos',
    name: 'Signature Burritos',
    blurb: 'The ones people drive across town for.',
    items: [
      {
        id: 'surf-and-turf',
        name: 'Surf & Turf Burrito',
        description:
          'Carne asada and grilled shrimp layered with beans, Mexican rice and QB sauce.',
        price: null,
        image: null,
        tone: 'asada',
        verified: true,
      },
      {
        id: 'phx-burrito',
        name: 'PHX Burrito',
        description: 'Crispy french fries, carne asada and guacamole, all wrapped up.',
        price: null,
        image: null,
        tone: 'fries',
        verified: true,
      },
    ],
  },
  {
    id: 'burritos',
    name: 'Burritos',
    blurb: 'Built to order. Wrapped quik.',
    items: [
      {
        id: 'burrito',
        name: 'Burrito',
        description: 'Your choice of meat with rice, beans, cheese, pico and lettuce.',
        price: null,
        image: null,
        tone: 'tortilla',
        verified: true,
      },
    ],
  },
  {
    id: 'breakfast',
    name: 'Breakfast',
    blurb: 'Served from open.',
    items: [
      {
        id: 'breakfast-burrito',
        name: 'Breakfast Burrito',
        description:
          'Your choice of meat with beans, cheese, pico, egg and potato.',
        price: null,
        image: null,
        tone: 'breakfast',
        verified: true,
      },
      {
        id: 'pork-mania',
        name: 'Pork Mania Burrito',
        description: null,
        price: null,
        image: null,
        tone: 'breakfast',
        verified: false,
        note: 'Named by a customer in a public review, not seen on an official menu listing. Confirm the exact name and description before showing it.',
      },
    ],
  },
  {
    id: 'tacos',
    name: 'Tacos',
    blurb: null,
    items: [
      {
        id: 'birria-tacos',
        name: 'Birria Tacos',
        description: 'Served with consommé for dipping.',
        price: null,
        image: null,
        tone: 'birria',
        verified: true,
      },
      {
        id: 'tacos',
        name: 'Tacos',
        description:
          'Two flour tacos with your choice of meat, cheese, lettuce, pico and queso fresco, with sides of rice and beans.',
        price: null,
        image: null,
        tone: 'salsa',
        verified: true,
      },
    ],
  },
  {
    id: 'house-specials',
    name: 'House Specials',
    blurb: null,
    items: [
      {
        id: 'qb-fries',
        name: 'Fries',
        description:
          'Crispy fries layered with cheese, beans, your choice of meat, pico, spicy cilantro ranch, chipotle ranch, QB sauce and queso fresco.',
        price: null,
        image: null,
        tone: 'fries',
        verified: true,
      },
      {
        id: 'nachos',
        name: 'Nachos',
        description: 'Beans, cheese, your choice of meat, lettuce, pico and sour cream.',
        price: null,
        image: null,
        tone: 'cheese',
        verified: true,
      },
      {
        id: 'quesadilla',
        name: 'Quesadilla',
        description: 'Cheese and your choice of meat.',
        price: null,
        image: null,
        tone: 'cheese',
        verified: true,
      },
    ],
  },
];

/** Only categories that still have at least one verified item. */
export const visibleMenu: MenuCategory[] = menu
  .map((c) => ({ ...c, items: c.items.filter((i) => i.verified) }))
  .filter((c) => c.items.length > 0);

export const unverifiedMenuItems = menu.flatMap((c) =>
  c.items.filter((i) => !i.verified).map((i) => ({ category: c.name, ...i })),
);

export function findItem(id: string): MenuItem | undefined {
  return menu.flatMap((c) => c.items).find((i) => i.id === id);
}

/** True when at least one price has been filled in by the owner. */
export const hasAnyPrice = menu.some((c) => c.items.some((i) => i.price !== null));
