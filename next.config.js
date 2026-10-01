/** @type {import('next').NextConfig} */

let supabaseHostname = null;
try {
  if (process.env.SUPABASE_URL) {
    supabaseHostname = new URL(process.env.SUPABASE_URL).hostname;
  }
} catch {
  // ignore malformed URL — image remote pattern just won't be added
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...(supabaseHostname
        ? [{ protocol: 'https', hostname: supabaseHostname, pathname: '/storage/v1/object/public/**' }]
        : []),
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
  async redirects() {
    return [
      // /insights was live and may be indexed or linked. A permanent
      // redirect hands its search ranking to the renamed page.
      { source: '/insights', destination: '/blogs', permanent: true },
    ];
  },
};

module.exports = nextConfig;
