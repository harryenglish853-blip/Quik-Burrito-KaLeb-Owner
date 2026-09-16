'use client';

import React, { useCallback } from 'react';
import { CineScene, Layer, BuildArgs } from './CineScene';
import { Vignette } from '@/components/atmosphere';
import { LocationSelector } from '@/components/LocationSelector';
import { openLocations } from '@/data/locations';

/**
 * SCENE 11 — LOCATIONS (92–96%)
 * The camera pulls away from the food and up over an abstract Arizona, where
 * the verified Quik Burrito stores light up. Choosing one updates the whole
 * site — phone, hours, directions, ordering and reviews all follow it.
 */
export function LocationsScene() {
  const build = useCallback(({ tl, q }: BuildArgs) => {
    // Pull back and rise: food gives way to the map.
    tl.fromTo(q('.azmap'), { scale: 1.5, opacity: 0.25 }, { scale: 1, opacity: 1, ease: 'power2.out' }, 0)
      .fromTo(q('.azmap__pin'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.12, duration: 0.25 }, 0.25)
      .fromTo(q('.locwrap'), { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.35 }, 0.4);
  }, []);

  return (
    <CineScene
      id="locations"
      length={210}
      className="sc-locations"
      build={build}
      aria-label="Locations"
    >
      <Layer name="bg">
        <div className="bd bd--map" />
        <div className="azmap" aria-hidden="true">
          <div className="azmap__grid" />
          {openLocations.map((l, i) => (
            <span key={l.id} className="azmap__pin" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      </Layer>

      <Vignette strength={0.5} />

      <div className="locwrap shell">
        <LocationSelector />
      </div>
    </CineScene>
  );
}
