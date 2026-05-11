import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*',
  //       destination: 'https://holidaybrand.co/:path*',
  //       permanent: true,
  //     },
  //   ]
  // },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
