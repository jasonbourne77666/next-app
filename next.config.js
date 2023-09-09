/** @type {import('next').NextConfig} */

const path = require('path');
console.log('__dirname', path.join(__dirname, './src/styles/common.scss'));
const nextConfig = {
  //   pageExtensions: ['page.tsx', 'page.ts'],
  reactStrictMode: false,
  sassOptions: {
    additionalData: "@import '@/styles/common.scss';",
  },
};

module.exports = nextConfig;
