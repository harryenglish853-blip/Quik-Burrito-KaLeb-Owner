'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Location, openLocations, defaultLocation } from '@/data/locations';
import { track } from './analytics';

const STORAGE_KEY = 'qb:location';

type Ctx = {
  location: Location;
  /** True once a stored/explicit choice has been applied (vs. the default). */
  chosen: boolean;
  setLocation: (id: string) => void;
  clearLocation: () => void;
  locations: Location[];
};

const LocationContext = createContext<Ctx | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  // Always start from the default so server and first client render match —
  // no hydration flash, and the site is useful before any JS decision is made.
  const [id, setId] = useState<string>(defaultLocation.id);
  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && openLocations.some((l) => l.id === saved)) {
        setId(saved);
        setChosen(true);
      }
    } catch {
      /* storage unavailable — the default still works */
    }
  }, []);

  const setLocation = useCallback((next: string) => {
    if (!openLocations.some((l) => l.id === next)) return;
    setId(next);
    setChosen(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* not fatal */
    }
    track('location_selected', { location_id: next });
  }, []);

  const clearLocation = useCallback(() => {
    setChosen(false);
    setId(defaultLocation.id);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* not fatal */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      location: openLocations.find((l) => l.id === id) ?? defaultLocation,
      chosen,
      setLocation,
      clearLocation,
      locations: openLocations,
    }),
    [id, chosen, setLocation, clearLocation],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): Ctx {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside <LocationProvider>');
  return ctx;
}
