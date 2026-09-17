/**
 * PREVIEW=1 produces a fully static, self-contained export in ./out, used to
 * publish a shareable preview of the site.
 *
 * Two things change in that mode:
 *   assetPrefix '.'  — asset URLs become relative, so the export runs from any
 *                      directory rather than only from a domain root.
 *   images unoptimized — there is no server to optimise them.
 * `headers()` is not supported by `output: 'export'`, so it is omitted there.
 */
const isPreview = process.env.PREVIEW === '1';

/** @type {import('next').NextConfig} */
const base = {
  reactStrictMode: true,
  poweredByHeader: false,
};

const previewConfig = {
  ...base,
  output: 'export',
  assetPrefix: '.',
  images: { unoptimized: true },
};

const serverConfig = {
  ...base,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 390, 430, 640, 768, 1024, 1280, 1440, 1920, 2560],
  },
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default isPreview ? previewConfig : serverConfig;
