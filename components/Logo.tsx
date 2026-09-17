import React from 'react';
import { brandAssets } from '@/data/media';
import { mediaUrl } from '@/lib/preview';

/**
 * The wordmark.
 *
 * Renders the real logo when one has been configured, and otherwise falls back
 * to a type-set wordmark in the brand display font and brand colour — so the
 * site is never missing its own name.
 *
 * TO USE THE REAL LOGO:
 *   1. Save it as  public/media/brand/logo.svg  (a light-on-dark variant can go
 *      alongside it as logo-light.svg).
 *   2. Set `logo` (and optionally `logoLight`) in data/media.ts.
 *
 * The filename is configured rather than auto-detected on disk because this
 * component renders inside client components, where filesystem access is not
 * available.
 */
export function Logo({ onFilm = false, small = false }: { onFilm?: boolean; small?: boolean }) {
  // Prefer the light variant when sitting over the dark cinematic film.
  const src = (onFilm ? brandAssets.logoLight : null) ?? brandAssets.logo;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mediaUrl(`brand/${src}`)}
        alt="Quik Burrito"
        className={`logo-img ${small ? 'logo-img--sm' : ''}`}
      />
    );
  }

  return (
    <span className={`logo ${onFilm ? 'logo--film' : ''} ${small ? 'logo--sm' : ''}`}>
      <span className="logo__quik">QUIK</span>
      <span className="logo__burrito">BURRITO</span>
      <span className="sr-only">Quik Burrito, Arizona</span>
    </span>
  );
}
