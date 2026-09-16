'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { Vignette } from '@/components/atmosphere';
import { brand } from '@/data/brand';

/**
 * SCENE 8 — QUIK BURRITO THROUGH THE DAY (72–79%)
 * The restaurant itself, as Arizona light moves from morning to evening.
 * No claims are made about late-night service or any hours beyond the verified
 * ones shown on the locations section.
 */
export function DayScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    // The sky runs a full day as you scroll — and runs backwards if you scroll up.
    tl.fromTo(q('.sky'), { backgroundPositionY: '0%' }, { backgroundPositionY: '100%' }, 0)
      .fromTo(q('.sun'), { yPercent: 40, xPercent: -30 }, { yPercent: 150, xPercent: 40 }, 0)
      .fromTo(q('.sun'), { opacity: 0.35 }, { opacity: 1, duration: 0.4 }, 0)
      .to(q('.sun'), { opacity: 0, duration: 0.3 }, 0.7)
      .fromTo(q('.storefront'), { yPercent: 12, scale: 1.1 }, { yPercent: 0, scale: 1 }, 0)
      .fromTo(q('.storefront__light'), { opacity: 0 }, { opacity: 1 }, 0.55)
      .fromTo(q('.copy'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25 }, 0.4);
  }, []);

  return (
    <CineScene id="day" length={210} className="sc-day" build={build} aria-label="Through the day">
      <Layer name="bg">
        <div className="sky bd bd--day" />
        <div className="sun" />
      </Layer>

      <Layer name="mid">
        <div className="storefront">
          <div className="storefront__band" />
          <div className="storefront__sign">QUIK BURRITO</div>
          <div className="storefront__window" />
          <div className="storefront__light" />
        </div>
      </Layer>

      <Vignette strength={0.45} />

      <Copy className="on-film">
        <p className="copy__line">{brand.campaign.day[0]}</p>
        <h2 className="copy__title">{brand.campaign.day[1]}</h2>
      </Copy>
    </CineScene>
  );
}
