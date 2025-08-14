/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost', 
      'res.cloudinary.com',
      'images.unsplash.com',
      'unsplash.com',
      'plus.unsplash.com',
      'collection.cloudinary.com',
      'scxfuzbtsvprczztxuca.supabase.co'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
