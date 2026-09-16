'use client';

import React, { useEffect } from 'react';
import { getLocation } from '@/data/locations';
import { useLocation } from '@/lib/location-context';
import { OrderOnlineButton, CallButton, DirectionsButton } from '@/components/actions';

/**
 * Landing on a store page is itself a choice of store: the rest of the site
 * switches to it, so the header, order bar and drawer never point elsewhere.
 */
export function LocationPageActions({ slug }: { slug: string }) {
  const { location, setLocation } = useLocation();
  const target = getLocation(slug);

  useEffect(() => {
    if (target && location.id !== target.id) setLocation(target.id);
  }, [target, location.id, setLocation]);

  if (!target) return null;

  return (
    <div className="cta-row cta-row--left">
      <OrderOnlineButton location={target} surface="location_page" />
      <CallButton location={target} surface="location_page" />
      <DirectionsButton location={target} surface="location_page" className="btn btn--secondary" />
    </div>
  );
}
