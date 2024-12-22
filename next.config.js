/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    typescript: {
      ignoreBuildErrors: true,
    },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    reactStrictMode: true,
  }
  
  module.exports = nextConfig