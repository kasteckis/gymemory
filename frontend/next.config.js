const runtimeCaching = require('next-pwa/cache')
const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
})

module.exports = nextConfig
