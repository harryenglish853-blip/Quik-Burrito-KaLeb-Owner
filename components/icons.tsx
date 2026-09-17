import React from 'react';

/**
 * Inline icons.
 *
 * Emoji were standing in here and they undercut the whole page: they render in
 * a different style on every platform, ignore the brand colour, and sit on
 * their own baseline. These are stroked to match the type weight, inherit
 * `currentColor`, and stay crisp at any size.
 */

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
};

export function PhoneIcon({ className = 'icon' }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M21 16.9v2.6a1.7 1.7 0 0 1-1.9 1.7 17 17 0 0 1-7.4-2.6 16.7 16.7 0 0 1-5.1-5.1A17 17 0 0 1 4 6.1 1.7 1.7 0 0 1 5.7 4h2.6a1.7 1.7 0 0 1 1.7 1.5c.1.9.3 1.7.6 2.5a1.7 1.7 0 0 1-.4 1.8l-1.1 1.1a13.7 13.7 0 0 0 5 5l1.1-1.1a1.7 1.7 0 0 1 1.8-.4c.8.3 1.6.5 2.5.6A1.7 1.7 0 0 1 21 16.9Z" />
    </svg>
  );
}

export function PinIcon({ className = 'icon' }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M20 10.5c0 5.4-8 12-8 12s-8-6.6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.3" r="2.9" />
    </svg>
  );
}

export function ArrowIcon({ className = 'icon' }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlayIcon({ className = 'icon' }: { className?: string }) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8a.8.8 0 0 0-1.2.7Z" />
    </svg>
  );
}
