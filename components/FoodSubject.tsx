import React from 'react';
import { Steam } from './atmosphere';
import { mediaConfig } from '@/data/media';
import type { FoodTone } from '@/data/menu';

export type SubjectVariant =
  | 'burrito'
  | 'burrito-bitten'
  | 'cross-section'
  | 'taco'
  | 'birria-dip'
  | 'breakfast'
  | 'bowl'
  | 'grill'
  | 'prep'
  | 'storefront'
  | 'bag';

/**
 * The hero food subject for a cinematic chapter.
 *
 * ART DIRECTION NOTE
 * ------------------
 * No photograph of Quik Burrito's real food was available for this build, and
 * a generated burrito must never stand in for a photo of theirs. Rather than
 * fake photorealism — which looks worse than nothing and would undersell food
 * that is the whole point of the site — each subject renders as a lit, framed
 * plate in the dish's own colour temperature: the exact size, crop and position
 * the real photograph will occupy.
 *
 * The camera choreography, lighting and pacing are all built against these
 * frames, so dropping in real photography via `src` completes the scene without
 * touching a single animation.
 */

const FRAME: Record<SubjectVariant, { tone: FoodTone; ratio: string; label: string }> = {
  'burrito':        { tone: 'tortilla',  ratio: '4 / 3', label: 'Signature burrito, warm off the griddle' },
  'burrito-bitten': { tone: 'asada',     ratio: '4 / 3', label: 'Burrito, bite taken, wrapper open' },
  'cross-section':  { tone: 'salsa',     ratio: '1 / 1', label: 'Burrito cut open — rice, beans, meat, cheese, pico' },
  'taco':           { tone: 'birria',    ratio: '4 / 3', label: 'Street tacos' },
  'birria-dip':     { tone: 'birria',    ratio: '4 / 5', label: 'Birria taco dipped in consommé' },
  'breakfast':      { tone: 'breakfast', ratio: '4 / 3', label: 'Breakfast burrito in morning light' },
  'bowl':           { tone: 'greens',    ratio: '1 / 1', label: 'Burrito bowl' },
  'grill':          { tone: 'asada',     ratio: '4 / 3', label: 'Meat on the grill — sear, steam and flame' },
  'prep':           { tone: 'salsa',     ratio: '4 / 3', label: 'The prep line — a burrito being built to order' },
  'storefront':     { tone: 'fries',     ratio: '16 / 9', label: 'The restaurant — counter, signage, Arizona light' },
  'bag':            { tone: 'tortilla',  ratio: '3 / 4', label: 'Finished order on the counter' },
};

const TONES: Record<FoodTone, { a: string; b: string; c: string }> = {
  tortilla:  { a: '#FFF1D6', b: '#E3B876', c: '#8F6531' },
  asada:     { a: '#F6C27B', b: '#A8461A', c: '#3A1B0C' },
  birria:    { a: '#FFC47A', b: '#B8300F', c: '#3A0F06' },
  breakfast: { a: '#FFE6AE', b: '#F0A544', c: '#8A4E1B' },
  salsa:     { a: '#FFB07A', b: '#C42B1C', c: '#4A0F0A' },
  cheese:    { a: '#FFECC0', b: '#F2B23C', c: '#94581A' },
  fries:     { a: '#FFDF92', b: '#D98226', c: '#6B3A10' },
  greens:    { a: '#E2F0B4', b: '#4F7A3A', c: '#1E3316' },
};

export function FoodSubject({
  variant,
  src,
  alt,
  steam = false,
  className = '',
  slotName,
}: {
  variant: SubjectVariant;
  src?: string | null;
  alt?: string;
  steam?: boolean;
  className?: string;
  slotName?: string;
}) {
  const frame = FRAME[variant];

  if (src) {
    // A real photograph goes inside the same frame as the placeholder, so it
    // inherits the chapter's geometry, crop, radius and shadow — and so every
    // camera move written against the frame keeps working untouched.
    return (
      <div
        className={`subject subject--frame subject--shot ${className}`}
        style={{ '--ratio': frame.ratio } as React.CSSProperties}
      >
        <div className="mslot mslot--photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/media/${src}`} alt={alt ?? ''} loading="lazy" decoding="async" />
          {steam ? <Steam count={3} className="mslot__steam" /> : null}
        </div>
      </div>
    );
  }

  // The takeout bag stays a drawn object: it reads as packaging, not as a
  // faked photograph, and it carries the mark for the finale transition.
  if (variant === 'bag') {
    return (
      <div className={`subject subject--bag ${className}`} aria-hidden="true">
        <div className="bag">
          <span className="bag__body" />
          <span className="bag__fold" />
          <span className="bag__mark">QB</span>
        </div>
        {mediaConfig.showSlotBadges && slotName ? (
          <span className="subject__slot">Photo slot · {slotName}</span>
        ) : null}
      </div>
    );
  }

  const t = TONES[frame.tone];

  return (
    <div
      className={`subject subject--frame ${className}`}
      style={{ '--ratio': frame.ratio } as React.CSSProperties}
    >
      <div
        className="mslot"
        style={{ '--pa': t.a, '--pb': t.b, '--pc': t.c } as React.CSSProperties}
        role="img"
        aria-label={`${frame.label} — photograph to come.`}
      >
        <span className="mslot__bokeh" aria-hidden="true" />
        <span className="mslot__key" aria-hidden="true" />
        <span className="mslot__grain" aria-hidden="true" />
        {steam ? <Steam count={4} className="mslot__steam" /> : null}
        {mediaConfig.showSlotBadges ? (
          <span className="mslot__tag" aria-hidden="true">
            <span className="mslot__tag-dot" />
            {frame.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
