/** @type {import('next').NextConfig} */

const nextConfig = {
  // pageExtensions: ['page.tsx', 'page.ts'],
  // reactStrictMode: true,
  sassOptions: {
    additionalData: "@import '@/styles/common.scss';",
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    // Important: return the modified config
    config.externals = [
      ...config.externals,
      {
        // handle ws error,can't find module
        'utf-8-validate': 'commonjs utf-8-validate',
        bufferutil: 'commonjs bufferutil',
      },
    ];

    return config;
  },
};

module.exports = nextConfig;
