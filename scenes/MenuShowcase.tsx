'use client';

import React, { useCallback } from 'react';
import { SmartLink } from '@/components/SmartLink';
import { CineScene, Layer, Copy, BuildArgs } from './CineScene';
import { FoodPlate } from '@/components/FoodPlate';
import { Vignette } from '@/components/atmosphere';
import { ViewMenuButton } from '@/components/actions';
import { visibleMenu, findItem } from '@/data/menu';

/**
 * SCENE 5 — SIGNATURE FOOD (45–57%)
 * The camera travels across a table of Quik Burrito dishes. Rack focus: one
 * dish sharpens while the rest fall away, then focus moves to the next.
 *
 * Every dish here is a real, verified menu item — nothing invented.
 */
const SHOWCASE = [
  { id: 'birria-tacos', name: 'Birria Tacos', tone: 'birria' as const },
  { id: 'surf-and-turf', name: 'Surf & Turf Burrito', tone: 'asada' as const },
  { id: 'breakfast-burrito', name: 'Breakfast Burrito', tone: 'breakfast' as const },
  { id: 'phx-burrito', name: 'PHX Burrito', tone: 'fries' as const },
  { id: 'quesadilla', name: 'Quesadilla', tone: 'cheese' as const },
];

export function MenuShowcase() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    // Table-level tracking shot.
    tl.fromTo(q('.table'), { xPercent: 14 }, { xPercent: -14 }, 0);

    const n = SHOWCASE.length;
    SHOWCASE.forEach((_, i) => {
      const at = i / n;
      const span = 1 / n;
      // Rack focus in...
      tl.fromTo(
        q(`.dish-${i}`),
        { filter: 'blur(11px)', scale: 0.92, opacity: 0.55 },
        { filter: 'blur(0px)', scale: 1.06, opacity: 1, duration: span * 0.45 },
        at,
      )
        // ...hold, then let it fall back out of focus.
        .to(
          q(`.dish-${i}`),
          { filter: 'blur(9px)', scale: 0.95, opacity: 0.6, duration: span * 0.4 },
          at + span * 0.6,
        )
        .fromTo(
          q(`.dishname-${i}`),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: span * 0.3 },
          at + span * 0.1,
        )
        .to(q(`.dishname-${i}`), { opacity: 0, duration: span * 0.25 }, at + span * 0.68);
    });
  }, []);

  const totalItems = visibleMenu.reduce((n, c) => n + c.items.length, 0);

  return (
    <CineScene
      id="signature"
      length={260}
      className="sc-showcase"
      build={build}
      aria-label="Signature food"
    >
      <Layer name="bg">
        <div className="bd bd--table" />
      </Layer>

      <Layer name="mid">
        <div className="table">
          {SHOWCASE.map((d, i) => (
            <div key={d.id} className={`dish dish-${i}`}>
              <FoodPlate
                tone={d.tone}
                src={findItem(d.id)?.image ?? null}
                alt={findItem(d.id)?.image ? `${d.name} from Quik Burrito` : undefined}
                ratio="4 / 5"
                sizes="(max-width: 768px) 60vw, 22vw"
                slotName={d.id}
              />
              <span className={`dish__name dishname-${i}`}>{d.name}</span>
            </div>
          ))}
        </div>
      </Layer>

      <Vignette strength={0.55} />

      <Copy className="on-film sc-showcase__copy">
        <p className="copy__kicker">The Menu</p>
        <h2 className="copy__title">Everything they came for</h2>
        <p className="copy__sub">
          {totalItems} verified items across burritos, breakfast, tacos and house specials.
        </p>
        <div className="cta-row">
          <ViewMenuButton className="btn btn--order" label="View Full Menu" surface="showcase" />
          <SmartLink href="/menu" className="btn btn--onfilm">
            Open menu page
          </SmartLink>
        </div>
      </Copy>
    </CineScene>
  );
}
