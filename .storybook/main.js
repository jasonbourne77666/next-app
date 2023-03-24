const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  /** 暴露 public 目录给到 stotrybook，作为静态资源目录 */
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript-plugin',
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    // console.log(config.module.rules);
    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.(scss|sass)$/,
      exclude: /\.module\.(scss|sass)$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: false,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [['autoprefixer']],
            },
          },
        },
        {
          loader: 'sass-loader',
          options: {
            additionalData: `@import '@/styles/index.scss';`,
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.module\.(scss|sass)$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              mode: 'local',
              localIdentName: '[path]__[local]--[hash:base64:5]',
            },
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [['autoprefixer']],
            },
          },
        },
        {
          loader: 'sass-loader',
          options: {
            additionalData: `@import '@/styles/index.scss';`,
          },
        },
      ],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    // Return the altered config
    return config;
  },
};
