'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { KitchenBokeh, Vignette } from '@/components/atmosphere';
import { OrderOnlineButton, ViewMenuButton, CallButton, DirectionsButton } from '@/components/actions';
import { ReviewWall } from '@/components/ReviewWall';
import { useLocation } from '@/lib/location-context';
import { brand } from '@/data/brand';

/**
 * FINAL SCENE
 * Back to the burrito the journey opened on — but a bite is gone, the wrapper
 * is open, and the restaurant is still humming behind it. Social proof sits one
 * scroll above the last, largest ORDER ONLINE on the site.
 */
export function ClosingScene() {
  const { location } = useLocation();

  const build = useCallback(({ tl, q }: BuildArgs) => {
    tl.fromTo(q('.layer--subject'), { scale: 1.25, rotate: -4 }, { scale: 1, rotate: 1 }, 0)
      .fromTo(q('.layer--bg'), { scale: 1.12 }, { scale: 1 }, 0)
      .fromTo(q('.copy'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.25);
  }, []);

  return (
    <>
      <section className="finalproof" aria-label="Loved by Quik Burrito customers">
        <div className="shell">
          <p className="eyebrow">Loved by Quik Burrito customers</p>
          <ReviewWall locationId={location.id} />
        </div>
      </section>

      <CineScene
        id="closing"
        length={200}
        className="sc-closing cine--split-r"
        build={build}
        aria-label="Order Quik Burrito"
      >
        <Layer name="bg">
          <div className="bd bd--counter" />
          <KitchenBokeh />
        </Layer>

        <Layer name="subject">
          <div className="closing__set">
            <FoodSubject variant="burrito-bitten" slotName="bitten-burrito" />
            <span className="closing__salsa" aria-hidden="true" />
            <span className="closing__drink" aria-hidden="true" />
          </div>
        </Layer>

        <Vignette strength={0.6} />

        <Copy className="on-film">
          <p className="copy__kicker">{brand.campaign.closing}</p>
          <h2 className="copy__title copy__title--huge">Quik Burrito</h2>
          <div className="cta-row">
            <OrderOnlineButton surface="closing" size="xl" />
          </div>
          <div className="cta-row cta-row--secondary">
            <ViewMenuButton className="btn btn--onfilm" surface="closing" />
            <CallButton className="btn btn--onfilm" surface="closing" />
            <DirectionsButton className="btn btn--onfilm" surface="closing" />
          </div>
        </Copy>
      </CineScene>
    </>
  );
}
