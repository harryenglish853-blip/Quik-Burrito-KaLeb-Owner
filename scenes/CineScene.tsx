'use client';

import React, { useEffect, useRef } from 'react';
import { useDeviceTier } from '@/lib/device';

export type BuildArgs = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gsap: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tl: any;
  root: HTMLElement;
  /** Scoped querySelector, e.g. q('.layer-bg') */
  q: (sel: string) => Element[];
};

export type CineSceneProps = {
  id: string;
  /** Scroll distance for the scene, in vh. Longer = slower camera move. */
  length?: number;
  className?: string;
  /** Wires the scrubbed camera move. Omitted = a still composition. */
  build?: (args: BuildArgs) => void;
  children: React.ReactNode;
  'aria-label'?: string;
};

/**
 * One chapter of the cinematic journey.
 *
 * The section is taller than the viewport; the stage inside is sticky. Scroll
 * position scrubs a GSAP timeline, so the camera move follows the wheel exactly:
 * scroll up and it runs backwards, stop and it settles (scrub carries a little
 * inertia, then stops).
 *
 * Everything inside renders as ordinary, readable HTML first. GSAP only ever
 * adds transforms on top after mount — with JS off, WebGL missing, or reduced
 * motion set, the composition and every button still work.
 */
export function CineScene({
  id,
  length = 180,
  className = '',
  build,
  children,
  ...rest
}: CineSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const tier = useDeviceTier();
  const animate = tier !== 'static' && Boolean(build);

  useEffect(() => {
    if (!animate || !rootRef.current) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled || !rootRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom bottom',
            // Scrub with damping: the move tracks the wheel, keeps a touch of
            // inertia, and comes to rest when scrolling stops.
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
        build?.({
          gsap,
          tl,
          root: rootRef.current as HTMLElement,
          q: gsap.utils.selector(rootRef),
        });

        // Normalise the timeline to exactly 1 "second" so the position and
        // duration numbers each scene passes read as fractions of that scene's
        // scroll (0 = chapter start, 1 = chapter end). Without this the total
        // duration is whatever the tweens happen to add up to, and every beat
        // lands early.
        tl.set({}, {}, 1);
      }, rootRef);

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [animate, build]);

  return (
    <section
      id={id}
      ref={rootRef}
      className={`cine ${className}`}
      style={{ '--cine-length': `${length}vh` } as React.CSSProperties}
      {...rest}
    >
      <div className="cine__stage">{children}</div>
    </section>
  );
}

/** A depth layer inside a stage. Lower depth = further from camera. */
export function Layer({
  name,
  className = '',
  children,
  style,
}: {
  name: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`layer layer--${name} ${className}`} data-layer={name} style={style}>
      {children}
    </div>
  );
}

/** Typography over food. Always high-contrast, always readable. */
export function Copy({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`copy ${className}`}>{children}</div>;
}
