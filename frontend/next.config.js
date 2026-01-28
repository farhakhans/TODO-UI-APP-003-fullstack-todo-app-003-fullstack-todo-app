/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'api.yourdomain.com', 'todo-frontend-blush.vercel.app'], // Updated to include Vercel deployment
  },
  // Removed rewrites for Vercel compatibility
  // API calls should be handled directly by the deployed backend
}

module.exports = nextConfig