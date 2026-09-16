'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { Vignette } from '@/components/atmosphere';
import { brand } from '@/data/brand';

/**
 * SCENE 2 — INSIDE THE FLAVOR (16–25%)
 * The camera keeps travelling forward into the cross-section. The food itself
 * is the transition: tortilla, rice, beans, meat, cheese, pico pass the lens.
 */
export function IngredientScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    tl.fromTo(
      q('.layer--subject'),
      { scale: 0.86, opacity: 0.9 },
      { scale: 2.6, opacity: 1, ease: 'power1.in' },
      0,
    )
      .fromTo(q('.bd--macro'), { scale: 1 }, { scale: 1.35 }, 0)
      // One word at a time: each fully clears before the next arrives.
      .fromTo(q('.word-1'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.1 }, 0.06)
      .to(q('.word-1'), { opacity: 0, y: -20, duration: 0.1 }, 0.26)
      .fromTo(q('.word-2'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.1 }, 0.4)
      .to(q('.word-2'), { opacity: 0, y: -20, duration: 0.1 }, 0.6)
      .fromTo(q('.word-3'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.1 }, 0.74);
  }, []);

  return (
    <CineScene
      id="ingredients"
      length={200}
      className="sc-ingredients"
      build={build}
      aria-label="Inside the burrito"
    >
      <Layer name="bg">
        <div className="bd bd--macro" />
      </Layer>

      <Layer name="subject">
        <FoodSubject variant="cross-section" steam slotName="cross-section" />
      </Layer>

      <Vignette strength={0.5} />

      <Copy className="on-film">
        <div className="wordstack">
          <span className="copy__title word-1">{brand.campaign.ingredients[0]}</span>
          <span className="copy__title word-2">{brand.campaign.ingredients[1]}</span>
          <span className="copy__title word-3">{brand.campaign.ingredients[2]}</span>
        </div>
      </Copy>
    </CineScene>
  );
}
