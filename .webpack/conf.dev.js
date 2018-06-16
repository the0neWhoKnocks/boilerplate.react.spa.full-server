const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const TidyPlugin = require('@noxx/webpack-tidy-plugin');
const appConfig = require('../conf.app');
const { hashLength } = require('./vars');

const conf = {
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'cheap-module-source-map',
  entry: {
    app: [
      // Include an alternative client for WebpackDevServer. A client's job is to
      // connect to WebpackDevServer by a socket and get notified about changes.
      // When you save a file, the client will either apply hot updates (in case
      // of CSS changes), or refresh the page (in case of JS changes). When you
      // make a syntax error, this client will display a syntax error overlay.
      // Note: instead of the default WebpackDevServer client, we use a custom one
      // to bring better experience for Create React App users. You can replace
      // the line below with these two lines if you prefer the stock client:
      // require.resolve('webpack-dev-server/client') + '?/',
      // require.resolve('webpack/hot/dev-server'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
    ],
  },
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  },
  plugins: [
    // No reason to have this, other than to ensure that files will be written
    // to the proper location.
    new WriteFilePlugin({
      // Write only files that match extensions
      test: /\.(js|html)$/,
      useHashIndex: true,
    }),

    // TODO - this isn't working as expected
    new TidyPlugin({
      cleanPaths: './public/js/* ./public/css/*',
      hashLength,
      watching: true,
    }),

    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(appConfig.paths.NODE_MODULES),
  ],
};
const moduleRules = {
  babelLoader: {
    options: {
      /**
       * This is a feature of `babel-loader` for webpack (not Babel itself).
       * It enables caching results in ./node_modules/.cache/babel-loader/
       * directory for faster rebuilds.
       */
      cacheDirectory: true,
    },
  },
};

module.exports = {
  conf,
  moduleRules,
};
