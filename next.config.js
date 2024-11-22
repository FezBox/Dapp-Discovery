/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'curve.fi',
      },
      {
        protocol: 'https',
        hostname: 'gmx.io',
      },
      {
        protocol: 'https',
        hostname: 'icons.llama.fi',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
    ],
  },
}

module.exports = nextConfig
