import React from 'react';
import type { Metadata } from 'next';
import { openLocations, closedLocations } from '@/data/locations';
import { LocationSelector } from '@/components/LocationSelector';
import { RestaurantSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Locations',
  description:
    'Find Quik Burrito in Arizona. Address, hours, phone, directions and online ordering for every open location.',
  alternates: { canonical: '/locations' },
};

export default function LocationsPage() {
  return (
    <div className="page">
      {openLocations.map((l) => (
        <RestaurantSchema key={l.id} location={l} />
      ))}

      <header className="page__head shell">
        <p className="eyebrow">Arizona</p>
        <h1 className="page__title">Find a Quik Burrito</h1>
        <p className="page__lead">
          Pick your store and the site follows it — hours, phone, directions, ordering
          and reviews all stay with the location you chose.
        </p>
      </header>

      <div className="shell">
        <LocationSelector heading="Open now" />
      </div>

      {closedLocations.length > 0 ? (
        <div className="shell closednote">
          <h2 className="closednote__h">Previously open</h2>
          <p className="closednote__p">
            These addresses appear on older listings and are recorded as closed. They are
            listed here only so nobody drives to one by mistake.
          </p>
          <ul className="closednote__list">
            {closedLocations.map((c) => (
              <li key={c.name}>{c.name}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
