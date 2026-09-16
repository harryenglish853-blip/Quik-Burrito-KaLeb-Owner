'use client';

import React from 'react';
import { OrderOnlineButton, ViewMenuButton } from '@/components/actions';

export function ReviewsPageActions() {
  return (
    <div className="cta-row cta-row--left">
      <OrderOnlineButton surface="reviews_page" />
      <ViewMenuButton surface="reviews_page" />
    </div>
  );
}
