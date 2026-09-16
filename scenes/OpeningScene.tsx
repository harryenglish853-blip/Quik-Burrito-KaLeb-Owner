'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { KitchenBokeh, Vignette } from '@/components/atmosphere';
import { OrderOnlineButton, ViewMenuButton, CallButton } from '@/components/actions';
import { brand } from '@/data/brand';

/**
 * SCENE 1 — THE BURRITO (0–16%)
 * Opens already on food. No loader, no logo on black, nothing to wait through.
 * The camera pushes in, then arcs around the burrito as the brand resolves.
 */
export function OpeningScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    // Slow macro dolly toward the subject, then a gentle arc around it.
    tl.fromTo(
      q('.layer--subject'),
      { scale: 0.98, xPercent: 2, rotate: 2 },
      { scale: 1.16, xPercent: -3, rotate: -3, ease: 'power1.inOut' },
      0,
    )
      // Background drifts slower than the subject — parallax depth, not a slide.
      .fromTo(q('.layer--bg'), { scale: 1.08, yPercent: 0 }, { scale: 1.2, yPercent: -3 }, 0)
      .fromTo(q('.kbokeh'), { opacity: 0.55 }, { opacity: 0.2 }, 0)
      // The opening copy is NEVER faded in: the brand, the price-of-entry
      // sentence and ORDER ONLINE must be on screen in the first frame, before
      // any scrolling happens. Only a slow drift is animated.
      .fromTo(q('.copy'), { y: 0 }, { y: -26, duration: 1 }, 0)
      .to(q('.copy__kicker'), { letterSpacing: '0.34em', duration: 0.6 }, 0.2);
  }, []);

  return (
    <CineScene
      id="opening"
      length={230}
      className="sc-open cine--split"
      build={build}
      aria-label="Quik Burrito"
    >
      <Layer name="bg">
        <div className="bd bd--counter" />
        <KitchenBokeh />
      </Layer>

      <Layer name="subject">
        <FoodSubject variant="burrito" steam slotName="hero-burrito" />
      </Layer>

      <Vignette strength={0.62} />

      <Copy className="on-film">
        <p className="copy__kicker">Arizona</p>
        <h1 className="copy__title copy__title--huge">Quik Burrito</h1>
        <p className="copy__line">
          {brand.campaign.headline[0]} <br />
          {brand.campaign.headline[1]}
        </p>
        <p className="copy__sub">
          Mexican food built to order and wrapped fast. Start an order now — the menu and
          the phone are one tap away.
        </p>
        <div className="cta-row">
          <OrderOnlineButton surface="hero" size="xl" />
        </div>
        <div className="cta-row cta-row--two">
          <ViewMenuButton className="btn btn--onfilm" surface="hero" />
          <CallButton className="btn btn--onfilm" surface="hero" showNumber={false} />
        </div>
      </Copy>
    </CineScene>
  );
}
