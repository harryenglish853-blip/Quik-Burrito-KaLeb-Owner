'use client';

import React from 'react';
import { Location, formatPhone, telHref, formatAddress } from '@/data/locations';
import { show } from '@/data/verification';
import { useLocation } from '@/lib/location-context';
import { useMenuDrawer } from '@/lib/menu-drawer-context';
import { track } from '@/lib/analytics';
import { PhoneIcon, PinIcon } from './icons';

/* ------------------------------------------------------------------
   ORDER ONLINE — the primary action. One click, always live, never dead.
   ------------------------------------------------------------------ */

type OrderProps = {
  location?: Location;
  size?: 'default' | 'xl';
  className?: string;
  children?: React.ReactNode;
  surface?: string;
};

export function OrderOnlineButton({
  location,
  size = 'default',
  className = '',
  children,
  surface = 'unknown',
}: OrderProps) {
  const ctx = useLocation();
  const loc = location ?? ctx.location;
  const url = show(loc.orderUrl);

  // No verified URL would mean a dead primary CTA, which is worse than any
  // design problem on this page. Fall back to the phone so the customer can
  // always complete an order.
  if (!url) {
    const tel = telHref(loc);
    if (!tel) return null;
    return (
      <a
        href={tel}
        className={`btn btn--order ${size === 'xl' ? 'btn--order-xl' : ''} ${className}`}
        onClick={() => track('call_click', { location_id: loc.id, surface, reason: 'order_url_unverified' })}
      >
        Call to order — {formatPhone(loc)}
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn--order ${size === 'xl' ? 'btn--order-xl' : ''} ${className}`}
      onClick={() => track('order_online_click', { location_id: loc.id, surface })}
      data-qb-order
    >
      {children ?? 'Order Online'}
      <span className="sr-only"> from {loc.shortName} (opens in a new tab)</span>
    </a>
  );
}

/* ------------------------------------------------------------------
   CALL — tel: link. Dials on mobile, shows the number on desktop.
   ------------------------------------------------------------------ */

export function CallButton({
  location,
  className = 'btn btn--secondary',
  showNumber = true,
  surface = 'unknown',
}: {
  location?: Location;
  className?: string;
  showNumber?: boolean;
  surface?: string;
}) {
  const ctx = useLocation();
  const loc = location ?? ctx.location;
  const href = telHref(loc);
  const pretty = formatPhone(loc);

  if (!href || !pretty) return null;

  return (
    <a
      href={href}
      className={className}
      onClick={() => track('call_click', { location_id: loc.id, surface })}
    >
      <PhoneIcon />
      <span>{showNumber ? pretty : 'Call'}</span>
      <span className="sr-only">Call Quik Burrito {loc.shortName}</span>
    </a>
  );
}

/* ------------------------------------------------------------------
   GET DIRECTIONS — one tap, straight to native maps.
   ------------------------------------------------------------------ */

export function DirectionsButton({
  location,
  className = 'btn btn--quiet',
  label = 'Get Directions',
  surface = 'unknown',
}: {
  location?: Location;
  className?: string;
  label?: string;
  surface?: string;
}) {
  const ctx = useLocation();
  const loc = location ?? ctx.location;
  const url = show(loc.mapsUrl);
  const address = formatAddress(loc);

  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track('directions_click', { location_id: loc.id, surface })}
    >
      <PinIcon />
      <span>{label}</span>
      <span className="sr-only">
        {address ? ` to Quik Burrito at ${address}` : ''} (opens in maps)
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------
   VIEW MENU — opens the drawer instantly, no navigation, no scroll gate.
   ------------------------------------------------------------------ */

export function ViewMenuButton({
  className = 'btn btn--secondary',
  label = 'View Menu',
  surface = 'unknown',
}: {
  className?: string;
  label?: string;
  surface?: string;
}) {
  const { openMenu } = useMenuDrawer();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        track('menu_view', { surface });
        openMenu();
      }}
    >
      {label}
    </button>
  );
}
