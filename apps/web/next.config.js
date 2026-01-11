/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Don't use static export - use server-side rendering for dynamic routes
  // Netlify plugin will handle the deployment
};

module.exports = nextConfig;

