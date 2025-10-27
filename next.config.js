/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // TypeScript & ESLint configuration
  typescript: {
    // Dangerously allow production builds to complete even if there are type errors.
    // ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to complete even if there are ESLint errors.
    // ignoreDuringBuilds: false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Add image domains here when needed
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },

  // Experimental features (Next.js 14+)
  experimental: {
    // serverActions: true, // Already default in Next.js 14
  },

  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
}

module.exports = nextConfig
