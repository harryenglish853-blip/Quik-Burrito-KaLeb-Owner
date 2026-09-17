import type { MetadataRoute } from 'next';
import { openLocations } from '@/data/locations';

/* Both are already static; marking them so the preview export can emit them. */
export const dynamic = 'force-static';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quikburritoaz.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ['', '/menu', '/locations', '/reviews', '/about'].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const locationRoutes = openLocations.map((l) => ({
    url: `${SITE}/locations/${l.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...locationRoutes];
}
