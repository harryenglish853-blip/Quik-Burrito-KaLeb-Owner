import React from 'react';
import type { Metadata } from 'next';
import { openLocations } from '@/data/locations';
import { ReviewWall } from '@/components/ReviewWall';
import { ReviewsPageActions } from './ReviewsPageActions';

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'Real customer reviews for Quik Burrito in Arizona, kept per location and linked to their source.',
  alternates: { canonical: '/reviews' },
};

export default function ReviewsPage() {
  return (
    <div className="page">
      <header className="page__head shell">
        <p className="eyebrow">Social proof</p>
        <h1 className="page__title">What people are saying</h1>
        <p className="page__lead">
          Every review on this site is a real, publicly posted review, shown against the
          store it was actually written about and linked back to its source.
        </p>
        <ReviewsPageActions />
      </header>

      <div className="shell">
        {openLocations.map((loc) => (
          <section key={loc.id} id={loc.slug} className="revsec">
            <h2 className="revsec__h">{loc.shortName}</h2>
            <ReviewWall locationId={loc.id} />
          </section>
        ))}
      </div>
    </div>
  );
}
