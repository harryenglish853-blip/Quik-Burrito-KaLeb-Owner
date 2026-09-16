import React from 'react';
import Link from 'next/link';
import { Location, formatAddress, summarizeHours } from '@/data/locations';
import { show } from '@/data/verification';
import { OrderOnlineButton, CallButton, DirectionsButton } from './actions';

export function LocationCard({
  location,
  selected,
  onSelect,
  compact = false,
}: {
  location: Location;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}) {
  const address = formatAddress(location);
  const hours = show(location.hours);

  return (
    <article className={`loccard ${selected ? 'loccard--on' : ''}`}>
      <header className="loccard__head">
        <h3 className="loccard__name">{location.shortName}</h3>
        {selected ? <span className="loccard__badge">Your store</span> : null}
      </header>

      {address ? <p className="loccard__addr">{address}</p> : null}

      {hours ? (
        <dl className="loccard__hours">
          {summarizeHours(hours).map((row) => (
            <div key={row.days} className="loccard__hours-row">
              <dt>{row.days}</dt>
              <dd>{row.time}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="loccard__actions">
        <OrderOnlineButton location={location} surface="location_card" className="btn--block" />
        <div className="loccard__row">
          <CallButton location={location} surface="location_card" className="btn btn--secondary" />
          <DirectionsButton location={location} surface="location_card" className="btn btn--quiet" />
        </div>
        {!compact ? (
          <div className="loccard__row">
            <Link href={`/locations/${location.slug}`} className="btn btn--quiet">
              Store details
            </Link>
            <Link href={`/reviews#${location.slug}`} className="btn btn--quiet">
              Reviews
            </Link>
          </div>
        ) : null}
        {onSelect && !selected ? (
          <button type="button" className="btn btn--secondary btn--block" onClick={onSelect}>
            Make this my Quik Burrito
          </button>
        ) : null}
      </div>
    </article>
  );
}
