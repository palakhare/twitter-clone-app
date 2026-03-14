/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "i.ibb.co",          // ✅ imgbb domain
    ],
  },
};

module.exports = nextConfig;