'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { Steam, Vignette } from '@/components/atmosphere';
import { ViewMenuButton } from '@/components/actions';
import { brand } from '@/data/brand';
import { foodPhotos } from '@/data/media';

/**
 * SCENE 6 — THE BIRRIA MOMENT (57–65%)
 * The dip. Camera pushes in, the taco lowers into the consommé, liquid moves
 * with weight, steam lifts, droplets fall, focus rides the taco back up.
 *
 * Birria tacos with consommé are a confirmed Quik Burrito item.
 */
export function BirriaScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    // THE DIP, played on the shot itself: the frame lowers toward the consommé
    // pool, holds under, then rises with the pool settling behind it.
    tl.fromTo(q('.layer--subject'), { scale: 0.97 }, { scale: 1.05, ease: 'power1.inOut' }, 0)
      .fromTo(
        q('.subject--frame'),
        { yPercent: -7, rotate: -2 },
        { yPercent: 9, rotate: 1.5, duration: 0.3, ease: 'power2.in' },
        0.15,
      )
      .to(q('.subject--frame'), { yPercent: 7, duration: 0.12 }, 0.45)
      .to(q('.subject--frame'), { yPercent: -5, rotate: -0.5, duration: 0.3, ease: 'power2.out' }, 0.57)
      .fromTo(q('.copy'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.18 }, 0.34);
  }, []);

  return (
    <CineScene id="birria" length={240} className="sc-birria cine--split-r" build={build} aria-label="Birria">
      <Layer name="bg">
        <div className="bd bd--birria" />
      </Layer>

      <Layer name="subject">
        <FoodSubject
          variant="birria-dip"
          src={foodPhotos.birria.file}
          alt={foodPhotos.birria.alt}
          slotName="birria-dip"
        />
      </Layer>

      <Steam count={5} />
      <Vignette strength={0.6} />

      <Copy className="on-film">
        <p className="copy__kicker">Birria</p>
        <h2 className="copy__title">{brand.campaign.birria}</h2>
        <p className="copy__sub">Birria tacos, served with consommé for dipping.</p>
        <div className="cta-row">
          <ViewMenuButton className="btn btn--order" label="See the tacos" surface="birria" />
        </div>
      </Copy>
    </CineScene>
  );
}
