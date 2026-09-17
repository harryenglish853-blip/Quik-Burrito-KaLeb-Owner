'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { Vignette } from '@/components/atmosphere';
import { brand } from '@/data/brand';

/**
 * SCENE 4 — THE BUILD (35–45%)
 * The prep line. Ingredients land in order as the camera tracks along, then the
 * tortilla folds up across the lens and wipes the frame — the cut hides inside
 * the food. Pacing is quicker here: efficient, never careless.
 *
 * Every ingredient named is one Quik Burrito actually lists on the burrito.
 */
const STEPS = ['Tortilla', 'Protein', 'Rice', 'Beans', 'Cheese', 'Pico'];

export function BuildScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    tl.fromTo(
      q('.layer--subject'),
      { scale: 1.1, xPercent: 3 },
      { scale: 1, xPercent: -3 },
      0,
    ).fromTo(q('.copy'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2 }, 0.1);

    // Each ingredient lights up in turn, with weight — it drops and settles.
    STEPS.forEach((_, i) => {
      tl.fromTo(
        q(`.step-${i}`),
        { opacity: 0.25, y: -14, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.07, ease: 'power2.out' },
        0.24 + i * 0.075,
      );
    });

    // The wrap: the tortilla sweeps up over the lens and hides the cut.
    tl.fromTo(
      q('.wrapwipe'),
      { yPercent: 118, rotate: -7 },
      { yPercent: -4, rotate: 2, ease: 'power2.inOut', duration: 0.24 },
      0.74,
    );
  }, []);

  return (
    <CineScene
      id="build"
      length={210}
      className="sc-build cine--split"
      build={build}
      aria-label="The build"
    >
      <Layer name="bg">
        <div className="bd bd--prep" />
      </Layer>

      <Layer name="subject">
        <FoodSubject variant="prep" slotName="prep-line" />
      </Layer>

      <Layer name="fg">
        <div className="wrapwipe" />
      </Layer>

      <Vignette strength={0.5} />

      <Copy className="on-film">
        <p className="copy__kicker">Built to order</p>
        <h2 className="copy__title">
          {brand.campaign.build[0]}
          <br />
          {brand.campaign.build[1]}
        </h2>
        <ol className="steps" aria-label="How a burrito is built">
          {STEPS.map((label, i) => (
            <li key={label} className={`steps__item step-${i}`}>
              {label}
            </li>
          ))}
        </ol>
      </Copy>
    </CineScene>
  );
}
