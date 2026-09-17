'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { OrderOnlineButton, ViewMenuButton, CallButton, DirectionsButton } from '@/components/actions';
import { brand } from '@/data/brand';

/**
 * SCENE 12 — ORDERING FINALE (96–100%)
 * The finished order lands on the counter, the camera follows the bag in until
 * the mark fills the screen, and the frame opens onto the biggest button on the
 * site. This is the conversion point everything else has been building toward.
 */
export function OrderFinaleScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    tl.fromTo(
      q('.layer--subject'),
      { scale: 0.85, yPercent: 14, rotate: 2 },
      { scale: 3.1, yPercent: -8, rotate: -1, ease: 'power2.in' },
      0,
    )
      .to(q('.layer--subject'), { opacity: 0, duration: 0.18 }, 0.42)
      .fromTo(q('.bd--finale'), { opacity: 0.4 }, { opacity: 1, duration: 0.3 }, 0.3)
      .fromTo(q('.copy'), { opacity: 0, scale: 0.94, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.3 }, 0.48);
  }, []);

  return (
    <CineScene id="order" length={220} className="sc-finale" build={build} aria-label="Order now">
      <Layer name="bg">
        <div className="bd bd--finale" />
      </Layer>

      <Layer name="subject">
        <FoodSubject variant="bag" slotName="takeout-bag" />
      </Layer>


      <Copy className="on-brand">
        <p className="copy__kicker">{brand.campaign.finale[0]}</p>
        <h2 className="copy__title copy__title--huge">{brand.campaign.finale[1]}</h2>
        <div className="cta-row">
          <OrderOnlineButton surface="finale" size="xl" />
        </div>
        <div className="cta-row cta-row--secondary">
          <ViewMenuButton className="btn btn--onfilm" surface="finale" />
          <CallButton className="btn btn--onfilm" surface="finale" />
          <DirectionsButton className="btn btn--onfilm" surface="finale" />
        </div>
      </Copy>
    </CineScene>
  );
}
