import React from 'react';
import type { Metadata } from 'next';
import { visibleMenu } from '@/data/menu';
import { FoodPlate } from '@/components/FoodPlate';
import { MenuSchema } from '@/components/StructuredData';
import { MenuPageActions, MenuItemOrder } from './MenuPageActions';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'The Quik Burrito menu: signature burritos, breakfast burritos, birria tacos, quesadillas, nachos and loaded fries in Anthem, Arizona.',
  alternates: { canonical: '/menu' },
};

/**
 * The menu page. Fast, scannable, and calm — no scrub effects here. The
 * homepage sells the craving; this sells the food.
 */
export default function MenuPage() {
  return (
    <>
      <MenuSchema />

      <div className="page">
        <header className="page__head shell">
          <p className="eyebrow">Quik Burrito</p>
          <h1 className="page__title">The Menu</h1>
          <p className="page__lead">
            Built to order. Everything below is on the live menu — prices and current
            options are on the ordering page.
          </p>
          <MenuPageActions />
        </header>

        <nav className="menunav shell" aria-label="Menu categories">
          {visibleMenu.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="menunav__link">
              {c.name}
            </a>
          ))}
        </nav>

        <div className="shell">
          {visibleMenu.map((cat) => (
            <section key={cat.id} id={cat.id} className="mcat">
              <h2 className="mcat__title">{cat.name}</h2>
              {cat.blurb ? <p className="mcat__blurb">{cat.blurb}</p> : null}

              <ul className="mgrid">
                {cat.items.map((item) => (
                  <li key={item.id} className="mcard">
                    <FoodPlate
                      tone={item.tone}
                      src={item.image}
                      alt={item.image ? `${item.name} from Quik Burrito` : undefined}
                      ratio="4 / 3"
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 45vw, 30vw"
                      slotName={item.id}
                    />
                    <div className="mcard__body">
                      <h3 className="mcard__name">{item.name}</h3>
                      {item.description ? (
                        <p className="mcard__desc">{item.description}</p>
                      ) : null}
                      {item.price !== null ? (
                        <p className="mcard__price">${item.price.toFixed(2)}</p>
                      ) : null}
                      <MenuItemOrder itemName={item.name} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
