import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { openLocations, formatAddress, formatPhone, telHref, summarizeHours } from '@/data/locations';
import { show } from '@/data/verification';
import { brand } from '@/data/brand';
import { InstagramFollow } from './InstagramReel';

export function RestaurantFooter() {
  return (
    <footer className="foot">
      <div className="shell foot__inner">
        <div className="foot__brand">
          <Logo onFilm />
          <p className="foot__tag">
            Mexican food, made quik, in Arizona.
          </p>
          <InstagramFollow />
        </div>

        <div className="foot__cols">
          {openLocations.map((loc) => {
            const address = formatAddress(loc);
            const phone = formatPhone(loc);
            const tel = telHref(loc);
            const hours = show(loc.hours);
            const maps = show(loc.mapsUrl);
            return (
              <div key={loc.id} className="foot__col">
                <h3 className="foot__h">{loc.shortName}</h3>
                {address ? <p className="foot__p">{address}</p> : null}
                {phone && tel ? (
                  <p className="foot__p">
                    <a href={tel}>{phone}</a>
                  </p>
                ) : null}
                {hours ? (
                  <ul className="foot__hours">
                    {summarizeHours(hours).map((r) => (
                      <li key={r.days}>
                        <span>{r.days}</span> <span>{r.time}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {maps ? (
                  <p className="foot__p">
                    <a href={maps} target="_blank" rel="noopener noreferrer">
                      Get directions
                    </a>
                  </p>
                ) : null}
              </div>
            );
          })}

          <div className="foot__col">
            <h3 className="foot__h">Explore</h3>
            <ul className="foot__links">
              <li><Link href="/menu">Menu</Link></li>
              <li><Link href="/locations">Locations</Link></li>
              <li><Link href="/reviews">Reviews</Link></li>
              <li><Link href="/about">About</Link></li>
              <li>
                <a href={brand.social.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={brand.website} target="_blank" rel="noopener noreferrer">
                  quikburritoaz.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="shell foot__legal">
        <p>
          © {new Date().getFullYear()} {brand.legalName}. Hours and prices can change —
          the live ordering page is always current.
        </p>
      </div>
    </footer>
  );
}
