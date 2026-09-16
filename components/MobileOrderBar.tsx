'use client';

import React from 'react';
import { OrderOnlineButton, CallButton, DirectionsButton, ViewMenuButton } from './actions';

/**
 * Persistent mobile ordering bar.
 * Big ORDER ONLINE with smaller MENU / CALL / DIRECTIONS beside it.
 * Sits inside the safe area, thumb-height, and never covers page content —
 * <body> reserves --mobile-bar-h of bottom padding for it.
 */
export function MobileOrderBar() {
  return (
    <div className="obar" role="region" aria-label="Order from Quik Burrito">
      <OrderOnlineButton surface="mobile_bar" className="obar__order" />
      <div className="obar__mini">
        <ViewMenuButton className="obar__mini-btn" label="Menu" surface="mobile_bar" />
        <CallButton className="obar__mini-btn" showNumber={false} surface="mobile_bar" />
        <DirectionsButton className="obar__mini-btn" label="Directions" surface="mobile_bar" />
      </div>
    </div>
  );
}
