/**
 * VERIFICATION CONTRACT
 * =====================
 * Quik Burrito's site must never display invented information.
 *
 * Every fact in /data carries a `verified` flag and a `source`.
 * - verified: true   -> corroborated by a public source (recorded in `source`). Safe to render.
 * - verified: false  -> NOT confirmed. The UI must hide it (never guess a value on screen).
 *
 * Anything unconfirmed is written as the literal sentinel below so it is
 * greppable before launch:  `npm run build` prints a launch report, and
 * `rg VERIFY_BEFORE_LAUNCH data/` lists every open item.
 */

export const VERIFY_BEFORE_LAUNCH = 'VERIFY_BEFORE_LAUNCH' as const;
export const VERIFY_ORDER_URL_BEFORE_LAUNCH = 'VERIFY_ORDER_URL_BEFORE_LAUNCH' as const;

export type Unverified = typeof VERIFY_BEFORE_LAUNCH;

/** A value that may not yet be confirmed. */
export type Verifiable<T> = {
  value: T | Unverified;
  verified: boolean;
  /** Where the value came from, so the owner can re-check it. */
  source?: string;
  note?: string;
};

export function isVerified<T>(v: Verifiable<T>): v is Verifiable<T> & { value: T } {
  return v.verified && v.value !== VERIFY_BEFORE_LAUNCH;
}

/** Returns the value only when it is safe to render, otherwise null. */
export function show<T>(v: Verifiable<T> | undefined): T | null {
  if (!v) return null;
  return isVerified(v) ? (v.value as T) : null;
}

export function verified<T>(value: T, source: string, note?: string): Verifiable<T> {
  return { value, verified: true, source, note };
}

export function unverified<T>(note: string): Verifiable<T> {
  return { value: VERIFY_BEFORE_LAUNCH, verified: false, note };
}
