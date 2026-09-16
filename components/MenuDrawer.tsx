'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { visibleMenu } from '@/data/menu';
import { FoodPlate } from './FoodPlate';
import { OrderOnlineButton, CallButton } from './actions';
import { useMenuDrawer } from '@/lib/menu-drawer-context';
import { useLocation } from '@/lib/location-context';

/**
 * The menu is one tap away from anywhere — it never waits on the cinematic
 * scroll. Deliberately calm: no scrub effects, no parallax. The homepage sells
 * the craving; this sells the food.
 */
export function MenuDrawer() {
  const { open, closeMenu } = useMenuDrawer();
  const { location } = useLocation();
  const [active, setActive] = useState(visibleMenu[0]?.id ?? '');
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  // Focus trap — keyboard users never fall out of the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open}>
      <div className="drawer__scrim" onClick={closeMenu} />

      <div
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Quik Burrito menu"
        ref={panelRef}
      >
        <div className="drawer__head">
          <div>
            <p className="eyebrow" style={{ margin: 0 }}>
              {location.shortName}
            </p>
            <h2 className="drawer__title">The Menu</h2>
          </div>
          <button
            type="button"
            className="drawer__close"
            onClick={closeMenu}
            ref={closeRef}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="drawer__tabs" role="tablist" aria-label="Menu categories">
          {visibleMenu.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={active === cat.id}
              className={`drawer__tab ${active === cat.id ? 'is-active' : ''}`}
              onClick={() => {
                setActive(cat.id);
                document
                  .getElementById(`drawer-cat-${cat.id}`)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="drawer__body">
          {visibleMenu.map((cat) => (
            <section key={cat.id} id={`drawer-cat-${cat.id}`} className="drawer__cat">
              <h3 className="drawer__cat-title">{cat.name}</h3>
              {cat.blurb ? <p className="drawer__cat-blurb">{cat.blurb}</p> : null}

              <ul className="drawer__items">
                {cat.items.map((item) => (
                  <li key={item.id} className="mitem">
                    <div className="mitem__media">
                      <FoodPlate
                        tone={item.tone}
                        src={item.image}
                        alt={item.image ? `${item.name} from Quik Burrito` : undefined}
                        ratio="1 / 1"
                        sizes="88px"
                      />
                    </div>
                    <div className="mitem__text">
                      <h4 className="mitem__name">{item.name}</h4>
                      {item.description ? (
                        <p className="mitem__desc">{item.description}</p>
                      ) : null}
                      {/* No price is shown unless a real in-store price exists. */}
                      {item.price !== null ? (
                        <p className="mitem__price">${item.price.toFixed(2)}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="drawer__pricing-note">
            Current prices and full options are on the live ordering page.
          </p>
        </div>

        <div className="drawer__foot">
          <OrderOnlineButton surface="menu_drawer" className="btn--block" />
          <div className="drawer__foot-row">
            <CallButton surface="menu_drawer" className="btn btn--secondary" />
            <Link href="/menu" className="btn btn--quiet" onClick={closeMenu}>
              Full menu page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
