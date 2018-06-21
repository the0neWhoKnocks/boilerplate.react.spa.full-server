const path = require('path');
const webpack = require('webpack');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const TidyPlugin = require('@noxx/webpack-tidy-plugin');
const appConfig = require('../conf.app');
const { hashLength, hashedName } = require('./vars');

// These settings are shared by both `dev` & `prod` builds
const conf = {
  // The entry and module.rules.loader option is resolved relative to this directory
  context: appConfig.paths.ROOT,
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in the JS bundle.
  entry: {
    // set up all libs that are required by the app
    [appConfig.webpack.entries.VENDOR]: [
      `${ appConfig.paths.SRC }/polyfills`,
      'react',
      'react-dom',
      'prop-types',
      'glamor',
    ],
    // the actual app entry is in `conf.webpack`
    [appConfig.webpack.entries.APP]: [],
  },
  module: {
    strictExportPresence: true,
  },
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  output: {
    filename: `.${ appConfig.webpack.paths.OUTPUT }/js/${ hashedName }.js`,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  // Any shared plugins, that need no per-build configuration changes
  plugins: [
    new TidyPlugin({
      cleanPaths: `.${ appConfig.webpack.paths.OUTPUT }/js/*`,
      hashLength,
      watching: process.env.NODE_ENV === 'development',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    /**
     * Provides build progress in the CLI
     */
    new SimpleProgressWebpackPlugin({
      format: 'minimal',
    }),
    /**
     * Generate a manifest file which contains a mapping of all asset filenames
     * to their corresponding output file so that tools can load them without
     * having to know the hashed name.
     */
    new WebpackAssetsManifest({
      customize: (key, val) => ({
        key,
        value: val.replace(appConfig.webpack.paths.OUTPUT, ''),
      }),
      output: `${ appConfig.paths.DIST_PUBLIC }/${ appConfig.webpack.MANIFEST_NAME }`,
      publicPath: '/',
      writeToDisk: true,
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }.
    new webpack.DefinePlugin({
      // This is so the Shell can load up the appropriate Router, and not bloat
      // the bundle by including modules that won't be used on the client.
      'process.env.IS_CLIENT': JSON.stringify(true),
      // Using `window.` so that it can be referenced in JS files without "undefined var" errors
      // These vars should only be referenced once since WP replaces the variables
      // with the entire value, so you could possibly have a lot of duplicated data.
      'window.WP_GLOBALS': {
        app: JSON.stringify(appConfig.app),
      },
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  resolve: {
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.styl'],
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: [
      'node_modules',
      appConfig.paths.NODE_MODULES,
    ],
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(appConfig.paths.SRC, [appConfig.paths.PACKAGE_JSON]),
    ],
    // ensure any symlinked paths resolve to current repo
    symlinks: false,
  },
  stats: {
    chunks: false,
    colors: true,
    modules: false,
  },
};

module.exports = conf;
