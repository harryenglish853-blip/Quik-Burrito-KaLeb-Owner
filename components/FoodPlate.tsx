import React from 'react';
import Image from 'next/image';
import type { FoodTone } from '@/data/menu';
import { mediaConfig } from '@/data/media';
import { mediaUrl } from '@/lib/preview';

/**
 * A food image slot.
 *
 * When a real Quik Burrito photo has been dropped into /public/media, it is
 * rendered with next/image (AVIF/WebP, responsive, lazy). When one has not,
 * this renders an art-directed placeholder in the dish's colour temperature —
 * warm, appetising, and clearly NOT posing as a photograph of the real dish.
 *
 * Swapping in real photography is a one-line change: set `image` on the menu
 * item (or pass `src` here) to the file name under /public/media.
 */

const TONES: Record<FoodTone, { a: string; b: string; c: string; label: string }> = {
  tortilla: { a: '#F6E3C5', b: '#E0B87C', c: '#A9763C', label: 'warm flour tortilla' },
  asada:    { a: '#E9A65E', b: '#9A3D18', c: '#3A1B0C', label: 'grilled carne asada' },
  birria:   { a: '#E2662B', b: '#9B1B10', c: '#2E0D07', label: 'birria and consommé' },
  breakfast:{ a: '#FFD98A', b: '#F0A544', c: '#8A4E1B', label: 'breakfast burrito, morning light' },
  salsa:    { a: '#F07F4A', b: '#C42B1C', c: '#4A0F0A', label: 'fresh salsa and pico' },
  cheese:   { a: '#FFE3A3', b: '#F2B23C', c: '#94581A', label: 'melted cheese' },
  fries:    { a: '#FFD469', b: '#D98226', c: '#6B3A10', label: 'crispy fries' },
  greens:   { a: '#CFE38C', b: '#4F7A3A', c: '#1E3316', label: 'cilantro, onion and lime' },
};

export type FoodPlateProps = {
  tone: FoodTone;
  /** File under /public/media, e.g. "menu/surf-and-turf.jpg". */
  src?: string | null;
  /** Required when `src` is set: a truthful description of the real photo. */
  alt?: string;
  /** Layout hint for next/image. */
  sizes?: string;
  className?: string;
  /** Aspect ratio, e.g. "4 / 5". */
  ratio?: string;
  priority?: boolean;
  rounded?: boolean;
  /** Short caption describing what belongs here, for the owner. */
  slotName?: string;
};

export function FoodPlate({
  tone,
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, 40vw',
  className = '',
  ratio = '4 / 5',
  priority = false,
  rounded = true,
  slotName,
}: FoodPlateProps) {
  const t = TONES[tone];

  if (src) {
    return (
      <div
        className={`plate ${rounded ? 'plate--rounded' : ''} ${className}`}
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={mediaUrl(src)}
          alt={alt ?? ''}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`plate plate--placeholder ${rounded ? 'plate--rounded' : ''} ${className}`}
      style={
        {
          aspectRatio: ratio,
          '--pa': t.a,
          '--pb': t.b,
          '--pc': t.c,
        } as React.CSSProperties
      }
      role="img"
      aria-label={`Placeholder artwork in the colours of ${t.label}. A Quik Burrito photograph goes here.`}
    >
      <span className="plate__grain" aria-hidden="true" />
      <span className="plate__bokeh" aria-hidden="true" />
      <span className="plate__sheen" aria-hidden="true" />
      {mediaConfig.showSlotBadges && slotName ? (
        <span className="plate__slot" aria-hidden="true">
          Photo slot · {slotName}
        </span>
      ) : null}
    </div>
  );
}
