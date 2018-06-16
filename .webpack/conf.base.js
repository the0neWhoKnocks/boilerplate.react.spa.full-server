const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const appConfig = require('../conf.app');
const { hashedName } = require('./vars');

// ensures the favicon is always current with every new build
const faviconModTime = fs.statSync(appConfig.paths.FAVICON);

// These settings are shared by both `dev` & `prod` builds
const conf = {
  // The entry and module.rules.loader option is resolved relative to this directory
  context: appConfig.paths.ROOT,
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in the JS bundle.
  entry: {
    // set up all libs that are required by the app
    vendor: [
      `${ appConfig.paths.SRC }/polyfills`,
      'react',
      'react-dom',
      'prop-types',
    ],
    // the actual app entry is in `conf.webpack`
    app: [],
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
    filename: `js/${ hashedName }.js`,
    // The build folder.
    // Not used in dev but WebpackDevServer crashes without it:
    path: appConfig.paths.DIST_PUBLIC,
    // Set via the `homepage` prop in package.json or via the `PUBLIC_URL` CLI
    // environment variable.
    publicPath: process.env.WEBPACK_ASSETS_URL,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  // Any shared plugins, that need no per-build configuration changes
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    /**
     * Provides build progress in the CLI
     */
    new SimpleProgressWebpackPlugin({
      format: 'compact',
    }),
    /**
     * Generate a manifest file which contains a mapping of all asset filenames
     * to their corresponding output file so that tools can load them without
     * having to know the hashed name.
     */
    // new WebpackAssetsManifest({}),
    new WebpackAssetsManifest({
      customize: (key, val) => {
        return {
          key,
          value: val.replace('public/', ''),
        };
      },
      output: `${ appConfig.paths.DIST_PUBLIC }/bundle-manifest.json`,
      publicPath: '/',
      writeToDisk: true,
    }),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin({
      FACICON_MOD_TIME: faviconModTime.mtimeMs,
      PUBLIC_URL: appConfig.clientPaths.PUBLIC_URL,
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }.
    new webpack.DefinePlugin({
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
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      minify: {
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      template: appConfig.paths.INDEX_TEMPLATE,
    }),
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
};

module.exports = conf;
