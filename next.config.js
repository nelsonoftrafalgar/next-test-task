/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['static-img.aripaev.ee', 'via.placeholder.com'],
  },
  env: {
    SITE_URL: process.env.SITE_URL,
    REGION: process.env.REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  },
}
