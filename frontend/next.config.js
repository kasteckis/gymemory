const runtimeCaching = require('next-pwa/cache')
const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
})

module.exports = nextConfig
