const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./config/env');
const paths = require('./config/paths');
const appConfig = require('./conf.app.js');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP === 'true';
// Setup all the module rules as Objects so they can easily be inserted in any
// order, and to allow for easy manipulation of their props.
const moduleRules = {
  babelLoader: {
    test: /\.(js|jsx)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {},
  },
  eslintLoader: {
    test: /\.(js|jsx)$/,
    enforce: 'pre',
    use: [
      {
        options: {
          formatter: eslintFormatter,
          eslintPath: require.resolve('eslint'),
        },
        loader: require.resolve('eslint-loader'),
      },
    ],
    include: paths.appSrc,
  },
  fileLoader: {
    // Exclude `js` files to keep "css" loader working as it injects
    // it's runtime that would otherwise be processed through "file" loader.
    // Also exclude `html` and `json` extensions so they get processed
    // by webpacks internal loaders.
    exclude: [/\.js$/, /\.html$/, /\.json$/],
    loader: require.resolve('file-loader'),
    options: {
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
  styusLoader: {
    test: /\.styl$/,
    loader: 'style-loader!css-loader!stylus-loader'
  },
  urlLoader: {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  }
};
const htmlPluginConf = {
  inject: true,
  template: paths.appHtml,
};

// These settings are shared by both `dev` & `prod` builds
const conf = {
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in the JS bundle.
  entry: [
    // We ship a few polyfills by default:
    require.resolve('./config/polyfills')
  ],
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
    // The build folder.
    // Not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Set via the `homepage` prop in package.json or via the `PUBLIC_URL` CLI
    // environment variable.
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  // Any shared plugins, that need no per-build configuration changes
  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin(env.raw),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx', '.styl'],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
};

// Production build
if( process.env.NODE_ENV === 'production' ){
  // modules used only for prod build
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const ManifestPlugin = require('webpack-manifest-plugin');
  const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
  const CompressionPlugin = require('compression-webpack-plugin');

  // Some apps do not use client-side routing with pushState.
  // For these, "homepage" can be set to "." to enable relative asset paths.
  const shouldUseRelativeAssetPaths = publicPath === './';
  const cssFilename = 'static/css/[name].[contenthash:8].css';
  // ExtractTextPlugin expects the build output to be flat.
  // (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
  // However, our output is structured with css, js and media folders.
  // To have this structure working with relative paths, we have to use custom options.
  const extractTextPluginOptions = shouldUseRelativeAssetPaths
    ? // Making sure that the publicPath goes back to to build folder.
      { publicPath: Array(cssFilename.split('/').length).join('../') }
    : {};

  // Don't attempt to continue if there are any errors.
  conf.bail = true;
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  conf.devtool = shouldUseSourceMap ? 'source-map' : false;
  conf.output = Object.assign(
    conf.output,
    {
      // Generated JS file names (with nested folders).
      // There will be one main bundle, and one file per asynchronous chunk.
      // We don't currently advertise code splitting but Webpack supports it.
      filename: 'static/js/[name].[chunkhash:8].js',
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
    }
  );
  conf.plugins.push(
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      sourceMap: shouldUseSourceMap,
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return;
        }
        if (message.indexOf('Skipping static resource') === 0) {
          // This message obscures real errors so we ignore it.
          // https://github.com/facebookincubator/create-react-app/issues/2612
          return;
        }
        console.log(message);
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: publicUrl + '/index.html',
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/
    })
  );

  htmlPluginConf.minify = {
    removeComments: true,
    //collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  };

  moduleRules.babelLoader.options.compact = true;
  // The notation here is somewhat confusing.
  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader normally turns CSS into JS modules injecting <style>,
  // but unlike in development configuration, we do something different.
  // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
  // (second argument), then grabs the result CSS and puts it into a
  // separate file in our build process. This way we actually ship
  // a single CSS file in production instead of JS code injecting <style>
  // tags. If you use code splitting, however, any async bundles will still
  // use the "style" loader inside the async code so CSS from them won't be
  // in the main CSS file.
  // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
  moduleRules.styusLoader.loader = ExtractTextPlugin.extract(
    Object.assign(
      {
        fallback: require.resolve('style-loader'),
        use: [
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              minimize: true,
              sourceMap: shouldUseSourceMap,
            },
          },
          {
            loader: require.resolve('stylus-loader'),
            options: {},
          },
        ],
      },
      extractTextPluginOptions
    )
  );
}
// Dev build
else{
  // modules used only for dev build
  const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
  const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  conf.devtool = 'cheap-module-source-map';
  conf.entry = conf.entry.concat([
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
    require.resolve('react-dev-utils/webpackHotDevClient')
  ]);
  conf.output = Object.assign(
    conf.output,
    {
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: true,
      // This does not produce a real file. It's just the virtual path that is
      // served by WebpackDevServer in development. This is the JS bundle
      // containing code from all our entry points, and the Webpack runtime.
      filename: 'static/js/bundle.js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: 'static/js/[name].chunk.js',
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    }
  );
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  conf.performance = {
    hints: false,
  };
  conf.plugins.push(
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  );

  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables caching results in ./node_modules/.cache/babel-loader/
  // directory for faster rebuilds.
  moduleRules.babelLoader.options.cacheDirectory = true;
}

// Add any remaining entries
conf.entry = conf.entry.concat([
  // We include the app code last so that if there is a runtime error during
  // initialization, it doesn't blow up the WebpackDevServer client, and
  // changing JS code would still trigger a refresh.
  paths.appIndexJs,
]);
// Ensure module loader order, along with any prod/dev augmentations.
conf.module.rules = [
  // First, run the linter.
  // It's important to do this before Babel processes the JS.
  moduleRules.eslintLoader,
  {
    // "oneOf" will traverse all following loaders until one will
    // match the requirements. When no loader matches it will fall
    // back to the "file" loader at the end of the loader list.
    oneOf: [
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      moduleRules.urlLoader,
      // Process JS with Babel.
      moduleRules.babelLoader,
      // Process Stylus (CSS) files
      moduleRules.styusLoader,
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      // This loader doesn't use a "test" so it will catch all modules
      // that fall through the other loaders.
      moduleRules.fileLoader,
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
];
// Since plugin order doesn't matter we can add the remaining shared plugins here
// with any augmented options that they need on a per-build basis.
conf.plugins.push(
  // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin(htmlPluginConf)
);

// Add paths to webpack as alias'. This will allow us to `import` or `require` a
// path via a constant rather than having to use `../../etc/`.
for(let _path in appConfig.paths){
  conf.resolve.alias[_path] = appConfig.paths[_path];
}

module.exports = conf;
