import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async redirects() {
    return [
      // The page lived at /community-guidelines since Phase 2, before the
      // /connect/* routes existed. Section 5's IA puts it at /connect/guidelines.
      { source: '/community-guidelines', destination: '/connect/guidelines', permanent: true },
    ]
  },
}

export default nextConfig
