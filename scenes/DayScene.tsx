'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { Vignette } from '@/components/atmosphere';
import { DirectionsButton } from '@/components/actions';
import { brand } from '@/data/brand';

/**
 * SCENE 8 — QUIK BURRITO THROUGH THE DAY (72–79%)
 * The restaurant itself, as Arizona light runs from morning to evening. The sky
 * and the sun are driven by scroll, so the day reverses if you scroll back up.
 *
 * No claim is made about late-night service or any hours beyond the verified
 * ones shown in the locations section.
 */
export function DayScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    // A full day of Arizona light, scrubbed by the wheel.
    tl.fromTo(q('.sky'), { backgroundPositionY: '0%' }, { backgroundPositionY: '100%' }, 0)
      .fromTo(q('.sun'), { yPercent: 30, xPercent: -34 }, { yPercent: 150, xPercent: 38 }, 0)
      .fromTo(q('.sun'), { opacity: 0.4 }, { opacity: 1, duration: 0.4 }, 0)
      .to(q('.sun'), { opacity: 0, duration: 0.3 }, 0.7)
      .fromTo(q('.layer--subject'), { scale: 1.12, yPercent: 5 }, { scale: 1, yPercent: 0 }, 0)
      // Evening: the windows warm up from inside.
      .fromTo(q('.duskglow'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.55)
      .fromTo(q('.copy'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25 }, 0.3);
  }, []);

  return (
    <CineScene id="day" length={210} className="sc-day cine--stacked" build={build} aria-label="Through the day">
      <Layer name="bg">
        <div className="sky bd bd--day" />
        <div className="sun" />
      </Layer>

      <Layer name="subject">
        <div className="day__shot">
          <FoodSubject variant="storefront" slotName="storefront" />
          <span className="duskglow" aria-hidden="true" />
        </div>
      </Layer>

      <Vignette strength={0.4} />

      <Copy className="on-film sc-day__copy">
        <p className="copy__kicker">{brand.campaign.day[0]}</p>
        <h2 className="copy__title">Open from breakfast to dinner</h2>
        <p className="copy__sub">
          Morning burritos, the lunch rush, and dinner on the way home.
        </p>
        <div className="cta-row">
          <DirectionsButton className="btn btn--onfilm" surface="day_scene" />
        </div>
      </Copy>
    </CineScene>
  );
}
