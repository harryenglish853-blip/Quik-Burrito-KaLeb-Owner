import React from 'react';
import { SmartLink } from '@/components/SmartLink';

export default function NotFound() {
  return (
    <div className="page page--center">
      <div className="shell">
        <p className="eyebrow">Quik Burrito</p>
        <h1 className="page__title">That page moved.</h1>
        <p className="page__lead">The food didn&rsquo;t. Here&rsquo;s the way back.</p>
        <div className="cta-row cta-row--left">
          <SmartLink href="/menu" className="btn btn--order">
            View the menu
          </SmartLink>
          <SmartLink href="/locations" className="btn btn--secondary">
            Find a location
          </SmartLink>
          <SmartLink href="/" className="btn btn--quiet">
            Home
          </SmartLink>
        </div>
      </div>
    </div>
  );
}
