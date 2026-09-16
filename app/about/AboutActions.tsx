'use client';

import React from 'react';
import { OrderOnlineButton, CallButton } from '@/components/actions';

export function AboutActions() {
  return (
    <div className="cta-row cta-row--left">
      <OrderOnlineButton surface="about_page" />
      <CallButton surface="about_page" />
    </div>
  );
}
