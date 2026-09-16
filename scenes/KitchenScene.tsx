'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { GrillGlow, HeatHaze, Steam, Vignette } from '@/components/atmosphere';
import { brand } from '@/data/brand';

/**
 * SCENE 3 — THE GRILL (25–35%)
 * The dark char of the last frame becomes the grill. Handheld-feeling but
 * controlled: the camera settles low, heat rises, metal catches the light.
 */
export function KitchenScene() {
  const build = useCallback(({ tl, q, gsap }: BuildArgs) => {
    tl.fromTo(q('.grill'), { scale: 1.3, yPercent: 8 }, { scale: 1, yPercent: -4 }, 0)
      .fromTo(q('.glow'), { opacity: 0.35 }, { opacity: 1 }, 0)
      // Rack focus: the grill bars sharpen as the back of the kitchen softens.
      .fromTo(q('.grill__bars'), { filter: 'blur(12px)' }, { filter: 'blur(0px)' }, 0)
      .fromTo(q('.grill__back'), { filter: 'blur(2px)' }, { filter: 'blur(14px)' }, 0)
      .fromTo(q('.copy'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.3);

    // A slow, low-amplitude handheld sway — motivated, never shaky.
    gsap.to(q('.grill'), {
      xPercent: 1.2,
      yPercent: -1,
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
      className="sc-kitchen"
      build={build}
      aria-label="The grill"
    >
      <Layer name="bg">
        <div className="bd bd--grill" />
        <div className="grill__back" />
      </Layer>

      <Layer name="mid">
        <div className="grill">
          <div className="grill__bars" />
          <div className="grill__sear grill__sear--a" />
          <div className="grill__sear grill__sear--b" />
          <div className="grill__sear grill__sear--c" />
        </div>
      </Layer>

      <GrillGlow />
      <HeatHaze />
      <Steam count={6} />
      <Vignette strength={0.6} />

      <Copy className="on-film">
        <p className="copy__line">{brand.campaign.kitchen[0]}</p>
        <p className="copy__line">{brand.campaign.kitchen[1]}</p>
      </Copy>
    </CineScene>
  );
}
