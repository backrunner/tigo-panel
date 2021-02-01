/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const path = require('path');

module.exports = {
  css: {
    extract: true,
  },
  productionSourceMap: false,
  chainWebpack: (config) => {
    // drop debug lines
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.warnings = false;
        args[0].terserOptions.compress.drop_debugger = true;
        args[0].terserOptions.compress.pure_funcs = ['console.log'];
        return args;
      });
    }
  },
  configureWebpack: () => ({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'element-ui': '@pwp-app/better-element-ui',
      },
    },
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/),
    ],
  }),
};
