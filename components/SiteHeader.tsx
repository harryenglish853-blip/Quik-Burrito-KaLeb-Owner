'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { OrderOnlineButton, ViewMenuButton } from './actions';
import { useMenuDrawer } from '@/lib/menu-drawer-context';
import { useLocation } from '@/lib/location-context';

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const { openMenu } = useMenuDrawer();
  const { location } = useLocation();

  // Header starts transparent over the opening food shot, then turns solid the
  // moment readability requires it.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setNavOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <header className={`hdr ${solid ? 'hdr--solid' : ''}`} data-solid={solid}>
      <div className="hdr__inner shell">
        <Link href="/" className="hdr__logo" aria-label="Quik Burrito — home">
          <Logo onFilm={!solid} small />
        </Link>

        <nav className="hdr__nav" aria-label="Main">
          <button type="button" className="hdr__link" onClick={openMenu}>
            Menu
          </button>
          <Link href="/locations" className="hdr__link">
            Locations
          </Link>
          <Link href="/reviews" className="hdr__link">
            Reviews
          </Link>
          <Link href="/about" className="hdr__link">
            About
          </Link>
        </nav>

        <div className="hdr__actions">
          <span className="hdr__loc" aria-live="polite">
            {location.shortName}
          </span>
          <OrderOnlineButton surface="header" className="hdr__order" />
        </div>

        {/* Mobile: big, thumb-sized MENU + ORDER. Nothing tiny. */}
        <div className="hdr__mobile">
          <ViewMenuButton
            className="hdr__mobile-btn"
            label="Menu"
            surface="header_mobile"
          />
          <button
            type="button"
            className="hdr__mobile-btn hdr__mobile-btn--nav"
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? 'Close' : 'More'}
          </button>
        </div>
      </div>

      {navOpen ? (
        <div className="hdr__sheet" id="mobile-nav">
          <Link href="/locations" className="hdr__sheet-link" onClick={() => setNavOpen(false)}>
            Locations
          </Link>
          <Link href="/reviews" className="hdr__sheet-link" onClick={() => setNavOpen(false)}>
            Reviews
          </Link>
          <Link href="/about" className="hdr__sheet-link" onClick={() => setNavOpen(false)}>
            About
          </Link>
          <Link href="/menu" className="hdr__sheet-link" onClick={() => setNavOpen(false)}>
            Full menu page
          </Link>
        </div>
      ) : null}
    </header>
  );
}
