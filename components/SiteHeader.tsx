'use client';

import React, { useEffect, useState } from 'react';
import { SmartLink } from '@/components/SmartLink';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { OrderOnlineButton, ViewMenuButton } from './actions';
import { useMenuDrawer } from '@/lib/menu-drawer-context';
import { useLocation } from '@/lib/location-context';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const { openMenu } = useMenuDrawer();
  const { location } = useLocation();
  const pathname = usePathname();

  // Only the cinematic homepage opens with a dark food shot behind the header.
  // Every other page has a light background from the first pixel, so the header
  // must be solid immediately there — otherwise the light-on-film nav text sits
  // on a cream page and disappears.
  const overFilm = pathname === '/';

  // Over the film, the header starts transparent and turns solid the moment
  // readability requires it.
  useEffect(() => {
    if (!overFilm) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overFilm]);

  const solid = !overFilm || scrolled;

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setNavOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <header className={`hdr ${solid ? 'hdr--solid' : ''}`} data-solid={solid}>
      <div className="hdr__inner shell">
        <SmartLink href="/" className="hdr__logo" aria-label="Quik Burrito — home">
          <Logo onFilm={!solid} small />
        </SmartLink>

        <nav className="hdr__nav" aria-label="Main">
          <button type="button" className="hdr__link" onClick={openMenu}>
            Menu
          </button>
          <SmartLink href="/locations" className="hdr__link">
            Locations
          </SmartLink>
          <SmartLink href="/reviews" className="hdr__link">
            Reviews
          </SmartLink>
          <SmartLink href="/about" className="hdr__link">
            About
          </SmartLink>
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
          <SmartLink href="/locations" className="hdr__sheet-link" onClick={() => setNavOpen(false)}>
            Locations
          </SmartLink>
          <SmartLink href="/reviews" className="hdr__sheet-link" onClick={() => setNavOpen(false)}>
            Reviews
          </SmartLink>
          <SmartLink href="/about" className="hdr__sheet-link" onClick={() => setNavOpen(false)}>
            About
          </SmartLink>
          <SmartLink href="/menu" className="hdr__sheet-link" onClick={() => setNavOpen(false)}>
            Full menu page
          </SmartLink>
        </div>
      ) : null}
    </header>
  );
}
