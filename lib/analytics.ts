/**
 * Conversion analytics.
 *
 * Fires into GA4 (gtag) and Meta Pixel (fbq) when—and only when—they are
 * present on the page. Nothing is loaded by this site on its own, so no
 * tracking happens until the owner adds a provider and, where required,
 * obtains consent. See lib/consent.ts.
 */

export type ConversionEvent =
  | 'order_online_click'
  | 'call_click'
  | 'directions_click'
  | 'menu_view'
  | 'review_click'
  | 'location_selected'
  | 'instagram_click';

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    fbq?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: ConversionEvent, params: Params = {}): void {
  if (typeof window === 'undefined') return;

  // Respect the visitor's consent choice before sending anything.
  if (!hasAnalyticsConsent()) return;

  const payload = { ...params, event_category: 'conversion' };

  try {
    window.gtag?.('event', event, payload);
    window.fbq?.('trackCustom', event, params);
    window.dataLayer?.push({ event, ...params });
  } catch {
    // Analytics must never break ordering.
  }
}

const CONSENT_KEY = 'qb:analytics-consent';

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Default-deny only where a provider is configured and consent is required.
    // With no provider on the page the calls above are no-ops anyway.
    return window.localStorage.getItem(CONSENT_KEY) !== 'denied';
  } catch {
    return false;
  }
}

export function setAnalyticsConsent(granted: boolean): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
  } catch {
    /* storage blocked — treat as no consent */
  }
}
