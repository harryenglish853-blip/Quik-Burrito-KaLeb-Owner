'use client';

import { useEffect, useState } from 'react';

/** Honours the OS "reduce motion" setting, live. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return reduced;
}

export type Tier = 'full' | 'lite' | 'static';

/**
 * Picks how much cinema this device should be asked to render.
 *  full   — desktop / high-end mobile: scrubbed scenes + canvas atmosphere
 *  lite   — mid-range phones: scrubbed scenes, no canvas particle work
 *  static — low-end, save-data, or reduced-motion: beautiful stills only
 *
 * Starts at 'static' so the very first paint is the cheap, always-correct one,
 * then upgrades after mount. Ordering never depends on the result.
 */
export function useDeviceTier(): Tier {
  const [tier, setTier] = useState<Tier>('static');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setTier('static');
      return;
    }

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    const saveData = nav.connection?.saveData === true;
    const slowNet = /(^|-)2g$/.test(nav.connection?.effectiveType ?? '');
    const memory = nav.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    if (saveData || slowNet || memory <= 2 || cores <= 2) {
      setTier('static');
    } else if (coarse && (memory <= 4 || cores <= 4)) {
      setTier('lite');
    } else {
      setTier('full');
    }
  }, [reduced]);

  return tier;
}

/** True once the component has mounted on the client. */
export function useMounted(): boolean {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
