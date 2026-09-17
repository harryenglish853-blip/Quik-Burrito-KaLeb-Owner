import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SmartLink } from '@/components/SmartLink';
import {
  openLocations,
  getLocation,
  formatAddress,
  formatPhone,
  summarizeHours,
} from '@/data/locations';
import { show } from '@/data/verification';
import { RestaurantSchema } from '@/components/StructuredData';
import { ReviewWall } from '@/components/ReviewWall';
import { FoodPlate } from '@/components/FoodPlate';
import { LocationPageActions } from './LocationPageActions';
import { visibleMenu } from '@/data/menu';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return openLocations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return { title: 'Location not found' };

  const address = formatAddress(loc);
  const city = show(loc.address)?.city ?? 'Arizona';

  return {
    title: `${loc.shortName}, AZ`,
    description: address
      ? `Quik Burrito in ${city}, Arizona — ${address}. Burritos, breakfast burritos and birria tacos. Order online, call or get directions.`
      : `Quik Burrito in ${city}, Arizona. Order online, call or get directions.`,
    alternates: { canonical: `/locations/${loc.slug}` },
    openGraph: {
      title: `Quik Burrito — ${loc.shortName}, Arizona`,
      description: address ?? undefined,
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  const address = formatAddress(loc);
  const phone = formatPhone(loc);
  const hours = show(loc.hours);
  const city = show(loc.address)?.city ?? 'Arizona';

  return (
    <>
      <RestaurantSchema location={loc} />

      <div className="page">
        <header className="page__head shell">
          <p className="eyebrow">Quik Burrito</p>
          <h1 className="page__title">{loc.shortName}, Arizona</h1>
          {address ? <p className="page__lead">{address}</p> : null}
          <LocationPageActions slug={loc.slug} />
        </header>

        <div className="shell locpage">
          <section className="locpage__facts">
            <h2 className="locpage__h">Hours &amp; contact</h2>
            {hours ? (
              <dl className="locpage__hours">
                {summarizeHours(hours).map((r) => (
                  <div key={r.days} className="locpage__hours-row">
                    <dt>{r.days}</dt>
                    <dd>{r.time}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {phone ? (
              <p className="locpage__phone">
                <a href={`tel:${show(loc.phone)}`}>{phone}</a>
              </p>
            ) : null}
            <p className="locpage__small">
              Hours can change on holidays — the ordering page and a quick call are always
              current.
            </p>
          </section>

          <section className="locpage__food">
            <h2 className="locpage__h">From the menu</h2>
            <div className="locpage__plates">
              {visibleMenu
                .flatMap((c) => c.items)
                .slice(0, 4)
                .map((item) => (
                  <figure key={item.id} className="locpage__plate">
                    <FoodPlate
                      tone={item.tone}
                      src={item.image}
                      alt={item.image ? `${item.name} from Quik Burrito ${loc.shortName}` : undefined}
                      ratio="1 / 1"
                      sizes="(max-width: 700px) 45vw, 20vw"
                    />
                    <figcaption>{item.name}</figcaption>
                  </figure>
                ))}
            </div>
            <SmartLink href="/menu" className="btn btn--secondary">
              See the full menu
            </SmartLink>
          </section>
        </div>

        <section className="shell locpage__reviews" id={loc.slug}>
          <h2 className="locpage__h">Reviews for {loc.shortName}</h2>
          <p className="locpage__small">
            Reviews shown here belong to this store only — never pooled across locations.
          </p>
          <ReviewWall locationId={loc.id} />
        </section>

        <section className="shell locpage__seo">
          <h2 className="locpage__h">Mexican food in {city}</h2>
          <p>
            Quik Burrito is a family-run Mexican kitchen in {city}, Arizona, serving
            burritos built to order, breakfast burritos, birria tacos with consommé,
            quesadillas, nachos and loaded fries. Order online for pickup, call the store,
            or get directions and come in.
          </p>
        </section>
      </div>
    </>
  );
}
