import React from 'react';

/**
 * Wordmark. Drop the real Quik Burrito logo at /public/media/brand/logo.svg and
 * swap this component's internals for an <Image> to use it.
 */
export function Logo({ onFilm = false, small = false }: { onFilm?: boolean; small?: boolean }) {
  return (
    <span className={`logo ${onFilm ? 'logo--film' : ''} ${small ? 'logo--sm' : ''}`}>
      <span className="logo__quik">QUIK</span>
      <span className="logo__burrito">BURRITO</span>
      <span className="sr-only">Quik Burrito, Arizona</span>
    </span>
  );
}
