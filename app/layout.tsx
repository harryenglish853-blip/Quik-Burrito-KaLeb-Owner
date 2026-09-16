import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import '@/styles/globals.css';
import '@/styles/plate.css';
import '@/styles/chrome.css';
import '@/styles/cine.css';
import '@/styles/scenes.css';
import '@/styles/pages.css';

import { LocationProvider } from '@/lib/location-context';
import { MenuDrawerProvider } from '@/lib/menu-drawer-context';
import { SiteHeader } from '@/components/SiteHeader';
import { MenuDrawer } from '@/components/MenuDrawer';
import { MobileOrderBar } from '@/components/MobileOrderBar';
import { RestaurantFooter } from '@/components/RestaurantFooter';
import { brand } from '@/data/brand';

// Fonts are self-hosted by next/font — no layout shift, no third-party request.
const display = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://quikburritoaz.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Quik Burrito — Mexican Food in Anthem, Arizona',
    template: '%s · Quik Burrito',
  },
  description:
    'Quik Burrito serves burritos, breakfast burritos, birria tacos and house specials in Anthem, Arizona. Order online, view the menu, call the restaurant or get directions.',
  applicationName: brand.name,
  keywords: [
    'Quik Burrito',
    'burritos Anthem AZ',
    'Mexican food Anthem Arizona',
    'breakfast burritos Arizona',
    'birria tacos Arizona',
    'burritos near me',
    'Mexican food near me',
  ],
  openGraph: {
    type: 'website',
    siteName: brand.name,
    title: 'Quik Burrito — Mexican Food in Anthem, Arizona',
    description:
      'Burritos, breakfast burritos and birria tacos in Anthem, Arizona. Order online in one tap.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quik Burrito — Mexican Food in Anthem, Arizona',
    description: 'Burritos, breakfast burritos and birria tacos. Order online.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#c42b1c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <LocationProvider>
          <MenuDrawerProvider>
            <SiteHeader />
            <main id="main">{children}</main>
            <RestaurantFooter />
            <MenuDrawer />
            <MobileOrderBar />
          </MenuDrawerProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
