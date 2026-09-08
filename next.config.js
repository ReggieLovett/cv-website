/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /**
     * The image optimizer is ON.
     *
     * It was previously disabled with `unoptimized: true`, which is the
     * standard workaround for `output: 'export'` — but this app is not a
     * static export, and both of its deploy targets support the optimizer
     * (Vercel natively, Netlify through @netlify/plugin-nextjs v5). Left on,
     * `unoptimized` makes every `next/image` serve the original file: the
     * `sizes` attribute is ignored, no responsive variant is generated, and
     * no modern format is negotiated.
     *
     * That mattered here more than anywhere else on the page. `public/` holds
     * 33 MB of source images, including a 15.4 MB poster PNG that renders into
     * a column roughly 400px wide. Every visitor was downloading all of it.
     *
     * If a future host genuinely cannot run the optimizer, prefer per-image
     * `unoptimized` on the few that need it over turning it off globally.
     */
    formats: ['image/avif', 'image/webp'],
    // Matched to the column spans the gallery actually asks for, so the
    // optimizer generates the sizes the layout uses rather than the defaults.
    deviceSizes: [400, 640, 828, 1080, 1200, 1600, 1920],
    imageSizes: [96, 160, 256, 384],
  },
};

module.exports = nextConfig;
