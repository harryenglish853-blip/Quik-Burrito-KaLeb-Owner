'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { GrillGlow, HeatHaze, Steam, Vignette } from '@/components/atmosphere';
import { brand } from '@/data/brand';

/**
 * SCENE 3 — THE GRILL (25–35%)
 * The char of the last frame becomes the grill. The camera settles low, heat
 * rises off the surface and the glow swells as the shot comes into focus.
 */
export function KitchenScene() {
  const build = useCallback(({ tl, q, gsap }: BuildArgs) => {
    tl.fromTo(
      q('.layer--subject'),
      { scale: 1.18, yPercent: 6, rotate: 2 },
      { scale: 1, yPercent: -2, rotate: -1.5 },
      0,
    )
      // The grill comes up to heat as the camera arrives.
      .fromTo(q('.glow'), { opacity: 0.3 }, { opacity: 1 }, 0)
      // Rack focus: the shot sharpens as the room behind it falls away.
      .fromTo(q('.mslot'), { filter: 'blur(10px)' }, { filter: 'blur(0px)' }, 0)
      .fromTo(q('.bd--grill'), { scale: 1.12 }, { scale: 1 }, 0)
      .fromTo(q('.copy'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.22);

    // A slow, low-amplitude handheld sway — motivated, never shaky.
    gsap.to(q('.layer--subject'), {
      xPercent: 0.8,
      yPercent: -0.8,
      duration: 6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <CineScene
      id="kitchen"
      length={200}
      className="sc-kitchen cine--split-r"
      build={build}
      aria-label="The grill"
    >
      <Layer name="bg">
        <div className="bd bd--grill" />
      </Layer>

      <Layer name="subject">
        <FoodSubject variant="grill" steam slotName="grill" />
      </Layer>

      <GrillGlow />
      <HeatHaze />
      <Steam count={5} />
      <Vignette strength={0.55} />

      <Copy className="on-film">
        <p className="copy__kicker">The kitchen</p>
        <h2 className="copy__title">
          {brand.campaign.kitchen[0]}
          <br />
          {brand.campaign.kitchen[1]}
        </h2>
      </Copy>
    </CineScene>
  );
}
