import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page page--center">
      <div className="shell">
        <p className="eyebrow">Quik Burrito</p>
        <h1 className="page__title">That page moved.</h1>
        <p className="page__lead">The food didn&rsquo;t. Here&rsquo;s the way back.</p>
        <div className="cta-row cta-row--left">
          <Link href="/menu" className="btn btn--order">
            View the menu
          </Link>
          <Link href="/locations" className="btn btn--secondary">
            Find a location
          </Link>
          <Link href="/" className="btn btn--quiet">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
