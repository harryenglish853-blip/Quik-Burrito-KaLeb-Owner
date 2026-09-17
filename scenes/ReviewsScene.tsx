'use client';

import React, { useCallback } from 'react';
import { SmartLink } from '@/components/SmartLink';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { Vignette } from '@/components/atmosphere';
import { ReviewWall } from '@/components/ReviewWall';
import { useLocation } from '@/lib/location-context';

/**
 * SCENE 10 — REAL CUSTOMER REVIEWS (86–92%)
 * A receipt slides into frame and the camera pushes toward the paper until the
 * paper becomes the review wall.
 *
 * What is printed on that paper is governed entirely by data/reviews.ts. If the
 * verified list is empty, this section says so honestly and sends customers to
 * the live review pages instead of inventing testimonials.
 */
export function ReviewsScene() {
  const { location } = useLocation();

  const build = useCallback(({ tl, q }: BuildArgs) => {
    tl.fromTo(
      q('.receipt'),
      { yPercent: 120, rotate: -6, scale: 0.8 },
      { yPercent: 0, rotate: -1.5, scale: 1, ease: 'power2.out', duration: 0.26 },
      0,
    )
      // Push toward the paper — it fills the frame and becomes the wall.
      .to(q('.receipt'), { scale: 2.4, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.28)
      .fromTo(q('.reviewwall'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.22 }, 0.4);
  }, []);

  return (
    <CineScene
      id="reviews"
      length={220}
      className="sc-reviews"
      build={build}
      aria-label="Customer reviews"
    >
      <Layer name="bg">
        <div className="bd bd--paper" />
      </Layer>

      <Layer name="mid">
        <div className="receipt" aria-hidden="true">
          <div className="receipt__head">QUIK BURRITO</div>
          <div className="receipt__rule" />
          <div className="receipt__row"><span>Order</span><span>Ready</span></div>
          <div className="receipt__row"><span>Wait</span><span>Quik</span></div>
          <div className="receipt__rule" />
          <div className="receipt__thanks">THANK YOU</div>
        </div>
      </Layer>

      <Vignette strength={0.2} />

      <div className="reviewwall shell">
        <Copy className="reviewwall__head">
          <p className="eyebrow">{location.shortName}</p>
          <h2 className="copy__title">What people are saying</h2>
        </Copy>

        <ReviewWall locationId={location.id} />

        <div className="cta-row reviewwall__cta">
          <SmartLink href="/reviews" className="btn btn--secondary">
            Read more reviews
          </SmartLink>
        </div>
      </div>
    </CineScene>
  );
}
