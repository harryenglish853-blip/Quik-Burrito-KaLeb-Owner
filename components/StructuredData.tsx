import React from 'react';
import { Location, formatAddress, schemaOpeningHours } from '@/data/locations';
import { show } from '@/data/verification';
import { aggregateRating } from '@/data/reviews';
import { brand } from '@/data/brand';
import { visibleMenu } from '@/data/menu';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quikburritoaz.com';

/**
 * Restaurant structured data.
 * Only verified values are emitted — an unverified field is omitted entirely
 * rather than guessed, and no aggregate rating is published unless real rated
 * reviews exist in data/reviews.ts.
 */
export function RestaurantSchema({ location }: { location: Location }) {
  const address = show(location.address);
  const phone = show(location.phone);
  const hours = show(location.hours);
  const coords = show(location.coordinates);
  const orderUrl = show(location.orderUrl);
  const menuUrl = show(location.menuUrl);
  const rating = aggregateRating(location.id);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: location.name,
    url: `${SITE}/locations/${location.slug}`,
    servesCuisine: [...brand.cuisine],
    priceRange: '$',
    sameAs: [brand.social.instagram.url, brand.social.facebook, brand.website],
  };

  if (address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: 'US',
    };
  }
  if (phone) schema.telephone = phone;
  if (hours) schema.openingHours = schemaOpeningHours(hours);
  if (coords) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: coords.lat, longitude: coords.lng };
  }
  if (menuUrl) schema.hasMenu = menuUrl;
  if (orderUrl) {
    schema.potentialAction = {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: orderUrl,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
    };
  }
  if (rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Menu structured data — items only, never prices we have not verified. */
export function MenuSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${brand.name} Menu`,
    hasMenuSection: visibleMenu.map((cat) => ({
      '@type': 'MenuSection',
      name: cat.name,
      hasMenuItem: cat.items.map((item) => {
        const node: Record<string, unknown> = { '@type': 'MenuItem', name: item.name };
        if (item.description) node.description = item.description;
        if (item.price !== null) {
          node.offers = { '@type': 'Offer', price: item.price, priceCurrency: 'USD' };
        }
        return node;
      }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
