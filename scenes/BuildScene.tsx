'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { Vignette } from '@/components/atmosphere';
import { brand } from '@/data/brand';

const STEPS = [
  { label: 'Tortilla', cls: 'st--tortilla' },
  { label: 'Protein', cls: 'st--meat' },
  { label: 'Rice', cls: 'st--rice' },
  { label: 'Beans', cls: 'st--beans' },
  { label: 'Cheese', cls: 'st--cheese' },
  { label: 'Pico', cls: 'st--pico' },
];

/**
 * SCENE 4 — THE BUILD (35–45%)
 * Tracks along the prep line as the burrito is assembled, then the tortilla
 * folds across the lens and wipes the frame — the cut hides inside the food.
 * Pacing is quicker here: efficient, not careless.
 */
export function BuildScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    // Camera tracks sideways along the prep counter.
    tl.fromTo(q('.prep'), { xPercent: 6 }, { xPercent: -6 }, 0);

    // Ingredients land in sequence, with weight — they drop and settle.
    STEPS.forEach((s, i) => {
      tl.fromTo(
        q(`.${s.cls}`),
        { opacity: 0, y: -60, scaleY: 0.6 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.12, ease: 'power2.out' },
        0.06 + i * 0.1,
      );
    });

    // The wrap: tortilla sweeps up over the lens.
    tl.fromTo(
      q('.wrapwipe'),
      { yPercent: 115, rotate: -8 },
      { yPercent: -5, rotate: 2, ease: 'power2.inOut', duration: 0.28 },
      0.7,
    ).fromTo(q('.copy'), { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.58);
  }, []);

  return (
    <CineScene id="build" length={210} className="sc-build" build={build} aria-label="The build">
      <Layer name="bg">
        <div className="bd bd--prep" />
      </Layer>

      <Layer name="mid">
        <div className="prep">
          {STEPS.map((s) => (
            <div key={s.label} className={`st ${s.cls}`}>
              <span className="st__label">{s.label}</span>
            </div>
          ))}
        </div>
      </Layer>

      <Layer name="fg">
        <div className="wrapwipe" />
      </Layer>

      <Vignette strength={0.45} />

      <Copy className="on-film">
        <p className="copy__line">{brand.campaign.build[0]}</p>
        <p className="copy__line">{brand.campaign.build[1]}</p>
      </Copy>
    </CineScene>
  );
}
