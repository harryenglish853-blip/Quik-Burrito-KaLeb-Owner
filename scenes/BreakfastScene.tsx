'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { SunShaft, Steam, Vignette } from '@/components/atmosphere';
import { OrderOnlineButton, ViewMenuButton } from '@/components/actions';
import { brand } from '@/data/brand';

/**
 * SCENE 7 — BREAKFAST (65–72%)
 * Dark restaurant warmth opens out into Arizona morning light. The breakfast
 * burrito is a verified item: meat, beans, cheese, pico, egg and potato.
 */
export function BreakfastScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    // Dark-to-light transition: the morning arrives rather than cutting in.
    tl.fromTo(q('.bd--morning'), { opacity: 0.15 }, { opacity: 1, ease: 'power2.out' }, 0)
      .fromTo(q('.shaft'), { opacity: 0, xPercent: -12 }, { opacity: 1, xPercent: 6 }, 0)
      .fromTo(
        q('.layer--subject'),
        { scale: 1.18, yPercent: 6, rotate: 3 },
        { scale: 1, yPercent: 0, rotate: -2 },
        0,
      )
      .fromTo(q('.copy'), { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.3 }, 0.28);
  }, []);

  return (
    <CineScene
      id="breakfast"
      length={200}
      className="sc-breakfast cine--split"
      build={build}
      aria-label="Breakfast"
    >
      <Layer name="bg">
        <div className="bd bd--morning" />
      </Layer>

      <SunShaft angle={28} />

      <Layer name="subject">
        <FoodSubject variant="breakfast" steam slotName="breakfast-burrito" />
      </Layer>

      <Steam count={3} />
      <Vignette strength={0.3} />

      <Copy className="sc-breakfast__copy">
        <p className="copy__kicker">Mornings</p>
        <h2 className="copy__title">{brand.campaign.breakfast}</h2>
        <p className="copy__sub sc-breakfast__sub">
          Breakfast Burrito — your choice of meat with beans, cheese, pico, egg and potato.
        </p>
        <div className="cta-row">
          <OrderOnlineButton surface="breakfast" />
          <ViewMenuButton className="btn btn--secondary" label="Breakfast menu" surface="breakfast" />
        </div>
      </Copy>
    </CineScene>
  );
}
