const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const appConfig = require('../conf.app');

const conf = {
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: 'cheap-module-source-map',
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
  watch: true,
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
