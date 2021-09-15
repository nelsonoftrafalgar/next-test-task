/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['static-img.aripaev.ee', 'via.placeholder.com'],
  },
  env: {
    SITE_URL: process.env.SITE_URL,
  },
}
