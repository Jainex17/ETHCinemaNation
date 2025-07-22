const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    THEMOVIEDB_API_KEY: process.env.THEMOVIEDB_API_KEY,
  },
  images: {
    domains: ["image.tmdb.org", "localhost", "walletconnect.com"],
  },
};

module.exports = nextConfig;
