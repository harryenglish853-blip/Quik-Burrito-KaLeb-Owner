'use client';

import React from 'react';
import { useLocation } from '@/lib/location-context';
import { LocationCard } from './LocationCard';

/**
 * Choose your Quik Burrito.
 * Not a dropdown — a set of real, tappable stores over an Arizona-toned field.
 * The choice is remembered locally and can always be changed.
 */
export function LocationSelector({ heading = 'Choose your Quik Burrito' }: { heading?: string }) {
  const { location, locations, setLocation, chosen, clearLocation } = useLocation();

  return (
    <div className="locsel">
      <div className="locsel__head">
        <h2 className="locsel__title">{heading}</h2>
        {chosen ? (
          <button type="button" className="btn btn--quiet" onClick={clearLocation}>
            Change location
          </button>
        ) : null}
      </div>

      {locations.length === 1 ? (
        <p className="locsel__single">
          One kitchen, and everything on this page — hours, phone, directions and ordering —
          belongs to it.
        </p>
      ) : (
        <p className="locsel__single">
          Pick a store and the whole site follows it: hours, phone, directions, ordering and
          reviews.
        </p>
      )}

      <div className="locsel__grid">
        {locations.map((loc) => (
          <LocationCard
            key={loc.id}
            location={loc}
            selected={loc.id === location.id && chosen}
            onSelect={() => setLocation(loc.id)}
          />
        ))}
      </div>
    </div>
  );
}
