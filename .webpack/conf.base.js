const path = require('path');
const webpack = require('webpack');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const TidyPlugin = require('@noxx/webpack-tidy-plugin');
const appConfig = require('../conf.app');
const { hashLength, hashedName } = require('./vars');

const PUBLIC_PATH = '/js/';

// These settings are shared by both `dev` & `prod` builds
const conf = {
  // The entry and module.rules.loader option is resolved relative to this directory
  context: appConfig.paths.ROOT,
  /**
   * These are the "entry points" for the bundling system. Each entry, will
   * be it's own file.
   */
  entry: {
    // You can dump any files you want in here that should be included top-level.
    // The rest of the file is generated via the CommonChunk plugin.
    [appConfig.webpack.entries.VENDOR]: [
      `${ appConfig.paths.SRC }/polyfills`,
    ],
    // Where the actual app code lives
    // NOTE - This Array has app entries pushed to it in the `conf.webpack.js`
    // file. This allows us to dynamically add in app code for dev or production
    // builds first, then add in the app code.
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
    // The path where bundled code is output. If this isn't set in conjunction,
    // with `publicPath`, the dynamic imports will prefix their paths with the
    // root directory resulting in missing scripts.
    path: `${ appConfig.paths.DIST_PUBLIC }${ PUBLIC_PATH }`,
    publicPath: PUBLIC_PATH,
    // assigns the hashed name to the file
    filename: `${ hashedName }.js`,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  // Any shared plugins, that need no per-build configuration changes
  plugins: [
    /**
     * Keep resources clean, ensures build dir is empty on build, and cleans out
     * old built files while in dev watch-mode.
     */
    new TidyPlugin({
      cleanOutput: true,
      hashLength,
    }),
    /**
     * Finds any references of modules from node_modules and dumps them in the
     * vendor bundle. Unless any new module deps are brought in, the hash for
     * this bundle won't change and can be cached independantly of app code.
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: appConfig.webpack.entries.VENDOR,
      minChunks: (module) => {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.includes('node_modules');
      },
    }),
    /**
     * Dump the remaining WP bootstrapping code into this file.
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: appConfig.webpack.entries.BOOTSTRAP,
      minChunks: Infinity,
    }),
    /**
     * Gives more control of how bundles are hashed
     */
    new webpack.HashedModuleIdsPlugin({
      hashDigestLength: hashLength,
    }),
    /**
     * Ensures chunks from dynamic imports use the chunk name that's specified.
     */
    new webpack.NamedChunksPlugin((chunk) => {
      if(chunk.name) return chunk.name;

      return chunk.modules.map(m => {
        const pathComponents = m.request.split('/');
        return pathComponents[pathComponents.length-1];
      }).join('_');
    }),
    /**
     * Provides build progress in the CLI
     */
    new SimpleProgressWebpackPlugin({
      format: 'minimal',
    }),
    /**
     * Creates a manifest of files that can be referenced by react-loadable
     * on the server so it can surface what modules were rendered for proper
     * Client hydration.
     */
    new ReactLoadablePlugin({
      filename: `${ appConfig.paths.DIST_PRIVATE }/react-loadable.json`,
    }),
    /**
     * Generate a manifest file which contains a mapping of all asset filenames
     * to their corresponding output file so that tools can load them without
     * having to know the hashed name.
     */
    new WebpackAssetsManifest({
      output: `${ appConfig.paths.DIST_PUBLIC }/${ appConfig.webpack.MANIFEST_NAME }`,
      // For some reason it doesn't use the `publicPath` from `output` so we
      // have to duplicate it here.
      publicPath: PUBLIC_PATH,
      sortManifest: false,
      writeToDisk: true,
    }),
    /**
     * Makes some environment variables available to the JS code, for example:
     * if (process.env.NODE_ENV === 'production') { ... }.
     */
    new webpack.DefinePlugin({
      // `process.env` vars will be replaced with their values when the bundle
      // is built. In the case `IS_CLIENT` for example, it'll always be `true`
      // on the client, and false/undefined in node (unless someone sets it).
      // This means that during the uglification step, it'll determine
      // anything in a block not `IS_CLIENT` unreachable, and remove it,
      // shrinking the bundle, and ensuring server code doesn't get shipped to
      // the client (all without the use of another module).
      'process.env.IS_CLIENT': true,
      'process.env.IS_SERVER': false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      // Using `window.` so that it can be referenced in JS files without "undefined var" errors
      // These vars should only be referenced once since WP replaces the variables
      // with the entire value, so you could possibly have a lot of duplicated data.
      'window.WP_GLOBALS': {
        app: JSON.stringify(appConfig.app),
      },
    }),
    /**
     * Moment.js is an extremely popular library that bundles large locale files
     * by default due to how Webpack interprets its code. This is a practical
     * solution that requires the user to opt into importing specific locales.
     * https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
     * You can remove this if you don't use Moment.js:
     */
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
