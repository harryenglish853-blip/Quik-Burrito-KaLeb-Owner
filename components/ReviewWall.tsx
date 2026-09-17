'use client';

import React from 'react';
import { reviewsFor, reviewSourcesFor, Review } from '@/data/reviews';
import { track } from '@/lib/analytics';
import { ArrowIcon } from './icons';

/**
 * Reviews, presented as order tickets pinned to the wall.
 *
 * Renders ONLY what data/reviews.ts actually contains. There is no filler mode
 * that fabricates testimonials: if no verified review has been entered for this
 * location, the wall says so plainly and points at the live review pages, which
 * are real and current.
 */
export function ReviewWall({ locationId }: { locationId: string }) {
  const reviews = reviewsFor(locationId);
  const sources = reviewSourcesFor(locationId);

  if (reviews.length > 0) {
    return (
      <ul className="tickets">
        {reviews.map((r, i) => (
          <li key={`${r.source}-${i}`} className="ticket" style={{ '--tilt': `${(i % 3) - 1}deg` } as React.CSSProperties}>
            <ReviewTicket review={r} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="nowall">
      <p className="nowall__lead">
        Quik Burrito&rsquo;s reviews are public and current — read them at the source.
      </p>
      <p className="nowall__note">
        <span className="verify-note">Verify before launch</span>{' '}
        No review is quoted here yet. Real reviewer names, ratings, wording and dates go in{' '}
        <code>data/reviews.ts</code>; until then this site links out rather than inventing
        testimonials.
      </p>

      <ul className="nowall__sources">
        {sources.map((s) => (
          <li key={s.source}>
            <a
              className="srccard"
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('review_click', { location_id: locationId, source: s.source })}
            >
              <span className="srccard__name">{s.source}</span>
              <span className="srccard__label">{s.label}</span>
              <ArrowIcon className="srccard__go" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReviewTicket({ review }: { review: Review }) {
  return (
    <figure className="ticket__inner">
      {review.rating !== null ? (
        <div className="ticket__stars" aria-label={`${review.rating} out of 5`}>
          <span aria-hidden="true">{'★'.repeat(Math.round(review.rating))}</span>
          <span aria-hidden="true" className="ticket__stars-off">
            {'★'.repeat(5 - Math.round(review.rating))}
          </span>
        </div>
      ) : null}

      <blockquote className="ticket__text">
        <p>{review.text}</p>
      </blockquote>

      <figcaption className="ticket__meta">
        <span className="ticket__who">{review.reviewer}</span>
        <a
          className="ticket__src"
          href={review.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('review_click', { location_id: review.locationId, source: review.source })}
        >
          {review.source}
          {review.date ? ` · ${new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
        </a>
      </figcaption>
    </figure>
  );
}
