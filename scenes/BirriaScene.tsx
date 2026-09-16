'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodSubject } from '@/components/FoodSubject';
import { Steam, Vignette } from '@/components/atmosphere';
import { ViewMenuButton } from '@/components/actions';
import { brand } from '@/data/brand';

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
    tl.fromTo(q('.layer--subject'), { scale: 0.94 }, { scale: 1.12, ease: 'power1.inOut' }, 0)
      .fromTo(
        q('.subject--frame'),
        { yPercent: -14, rotate: -3 },
        { yPercent: 16, rotate: 2, duration: 0.3, ease: 'power2.in' },
        0.15,
      )
      .to(q('.subject--frame'), { yPercent: 13, duration: 0.12 }, 0.45)
      .to(q('.subject--frame'), { yPercent: -10, rotate: -1, duration: 0.3, ease: 'power2.out' }, 0.57)
      // The consommé answers the taco: displaced, then settling.
      .fromTo(q('.pool'), { scaleY: 1, opacity: 0.85 }, { scaleY: 1.12, opacity: 1, duration: 0.2 }, 0.3)
      .to(q('.pool'), { scaleY: 1, duration: 0.35 }, 0.55)
      // Focus rides up with the taco — the pool falls away.
      .fromTo(q('.pool'), { filter: 'blur(2px)' }, { filter: 'blur(10px)', duration: 0.3 }, 0.55)
      .fromTo(q('.copy'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.18 }, 0.5);
  }, []);

  return (
    <CineScene id="birria" length={240} className="sc-birria cine--split-r" build={build} aria-label="Birria">
      <Layer name="bg">
        <div className="bd bd--birria" />
        <div className="pool" aria-hidden="true">
          <span className="pool__ripple" />
        </div>
      </Layer>

      <Layer name="subject">
        <FoodSubject variant="birria-dip" slotName="birria-dip" />
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
