'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { KitchenBokeh, Vignette } from '@/components/atmosphere';
import { InstagramReel, InstagramFollow } from '@/components/InstagramReel';
import { brand } from '@/data/brand';

/**
 * SCENE 9 — THE PEOPLE (79–86%)
 * The human side of the counter.
 *
 * No invented staff. No stock faces presented as Quik Burrito employees. The
 * atmosphere here is abstract on purpose, and the one real, human thing on the
 * screen is Quik Burrito's own Instagram reel — their footage, their people.
 */
export function PeopleScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    tl.fromTo(q('.layer--bg'), { scale: 1.16 }, { scale: 1 }, 0)
      .fromTo(q('.people__reel'), { opacity: 0, y: 60, rotate: 2 }, { opacity: 1, y: 0, rotate: 0, duration: 0.4 }, 0.1)
      .fromTo(q('.people__copy'), { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.35 }, 0.2);
  }, []);

  return (
    <CineScene id="people" length={190} className="sc-people" build={build} aria-label="The people">
      <Layer name="bg">
        <div className="bd bd--people" />
        <KitchenBokeh />
      </Layer>

      <Vignette strength={0.5} />

      <div className="people shell">
        <div className="people__reel">
          <InstagramReel caption="Straight from the counter" />
        </div>

        <Copy className="on-film people__copy">
          <p className="copy__kicker">{brand.social.instagram.handle}</p>
          <h2 className="copy__title">
            {brand.campaign.people[0]}
            <br />
            {brand.campaign.people[1]}
            <br />
            {brand.campaign.people[2]}
          </h2>
          <p className="copy__sub">
            A family-run kitchen in Arizona. The reel is their own.
          </p>
          <div className="cta-row">
            <InstagramFollow onFilm />
          </div>
        </Copy>
      </div>
    </CineScene>
  );
}
