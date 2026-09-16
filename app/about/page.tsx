import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/data/brand';
import { InstagramReel } from '@/components/InstagramReel';
import { AboutActions } from './AboutActions';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Quik Burrito is a family-run Mexican kitchen in Arizona serving burritos, breakfast burritos and birria tacos.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="page">
      <header className="page__head shell">
        <p className="eyebrow">Arizona</p>
        <h1 className="page__title">About Quik Burrito</h1>
        <p className="page__lead">
          A family-run Mexican kitchen, cooking to order and moving fast.
        </p>
        <AboutActions />
      </header>

      <div className="shell about">
        <div className="about__text">
          <h2 className="locpage__h">The short version</h2>
          <p>
            Quik Burrito is run by Arizonans, and the menu stays deliberately tight:
            burritos built to order, breakfast burritos, birria tacos served with
            consommé, quesadillas, nachos and loaded fries. Order online for pickup or
            call the store.
          </p>
          <p>
            {/* Only claims backed by a public source appear on this site. No founding
                date, store count, awards or sourcing claims are made anywhere. */}
            Everything else — hours, prices, today&rsquo;s options — lives on the live
            ordering page, which is always more current than any page of copy.
          </p>

          <h2 className="locpage__h">Follow along</h2>
          <p>
            The kitchen posts the food as it comes out. That is the most honest look at
            Quik Burrito there is.
          </p>
          <p>
            <Link href="/menu" className="btn btn--secondary">
              See the menu
            </Link>
          </p>
        </div>

        <div className="about__reel">
          <InstagramReel caption={`Watch ${brand.social.instagram.handle}`} />
        </div>
      </div>
    </div>
  );
}
