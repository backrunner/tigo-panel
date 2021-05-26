/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const path = require('path');
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  productionSourceMap: false,
  chainWebpack: (config) => {
    // drop debug lines
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = false;
        args[0].terserOptions.compress.warnings = false;
        args[0].terserOptions.compress.drop_debugger = true;
        return args;
      });
    }
    config.plugin('monaco-editor').use(MonacoEditorPlugin, [
      {
        languages: ['json', 'javascript', 'html', 'xml'],
      },
    ]);
  },
  configureWebpack: () => ({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'element-ui': '@pwp-app/better-element-ui',
        'vue-context-menu': '@pwp-app/vue-context-menu',
      },
    },
    plugins: [new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          element: {
            name: 'element',
            test: /[\\/]node_modules[\\/]@pwp-app[\\/]better-element-ui[\\/]/,
            priority: -10,
          },
          monaco: {
            name: 'monaco',
            test: /[\\/]node_modules[\\/]monaco-editor[\\/]/,
            priority: -10,
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -20,
          },
        },
      },
    },
  }),
  pluginOptions: {
    i18n: {
      locale: 'cn',
      fallbackLocale: 'en',
      localeDir: 'src/locales',
      enableInSFC: false,
    },
  },
};
