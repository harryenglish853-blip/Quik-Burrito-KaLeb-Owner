import React from 'react';

/**
 * Atmosphere layers.
 *
 * All CSS and SVG — no WebGL anywhere on this site. Nothing here can fail to
 * initialise, nothing blocks first paint, and a GPU-less device still gets the
 * composition. Each element is decorative and hidden from assistive tech.
 */

/** Rising steam. Slow, uneven, gravity-correct — it drifts and thins out. */
export function Steam({ count = 5, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`steam ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="steam__wisp"
          style={
            {
              '--i': i,
              '--x': `${12 + i * 19}%`,
              '--delay': `${i * 1.35}s`,
              '--dur': `${7.5 + (i % 3) * 2.2}s`,
              '--drift': `${(i % 2 ? 1 : -1) * (14 + i * 5)}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Heat distortion above a grill surface. */
export function HeatHaze({ className = '' }: { className?: string }) {
  return <div className={`haze ${className}`} aria-hidden="true" />;
}

/** Arizona sun through a window — warm directional key light. */
export function SunShaft({
  angle = 22,
  className = '',
}: {
  angle?: number;
  className?: string;
}) {
  return (
    <div
      className={`shaft ${className}`}
      aria-hidden="true"
      style={{ '--angle': `${angle}deg` } as React.CSSProperties}
    />
  );
}

/** Out-of-focus kitchen behind the subject. */
export function KitchenBokeh({ className = '' }: { className?: string }) {
  return (
    <div className={`kbokeh ${className}`} aria-hidden="true">
      <span /><span /><span /><span /><span /><span />
    </div>
  );
}

/** Embers / grill glow. */
export function GrillGlow({ className = '' }: { className?: string }) {
  return <div className={`glow ${className}`} aria-hidden="true" />;
}

/** Cinematic letterbox vignette that keeps overlaid type readable. */
export function Vignette({ strength = 0.55 }: { strength?: number }) {
  return (
    <div
      className="vignette"
      aria-hidden="true"
      style={{ '--v': strength } as React.CSSProperties}
    />
  );
}
