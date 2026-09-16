'use client';

import React from 'react';
import { OrderOnlineButton, CallButton, DirectionsButton } from '@/components/actions';

export function MenuPageActions() {
  return (
    <div className="cta-row cta-row--left">
      <OrderOnlineButton surface="menu_page" />
      <CallButton surface="menu_page" />
      <DirectionsButton surface="menu_page" />
    </div>
  );
}

export function MenuItemOrder({ itemName }: { itemName: string }) {
  return (
    <OrderOnlineButton surface={`menu_item:${itemName}`} className="mcard__order">
      Order
    </OrderOnlineButton>
  );
}
