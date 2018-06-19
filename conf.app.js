const { resolve } = require('path');
const packageJSON = require('./package.json');

// Some paths have to be normalized when this file is copied over to dist
const inDist = __dirname.endsWith('dist');
const ROOT = resolve(__dirname, (inDist) ? '../' : '');
const DIST = `${ ROOT }/dist`;
const DIST_PUBLIC = `${ DIST }/public`;
const SRC = (inDist) ? `${ DIST }/private` : `${ ROOT }/src`;
const SRC_STATIC = (inDist) ? DIST_PUBLIC : `${ SRC }/static`;
const SRC_MEDIA = `${ SRC_STATIC }/media`;
const PACKAGE_JSON = (inDist) ? `${ DIST }/package.json` : `${ ROOT }/package.json`;

const conf = {
  app: {
    NAME: packageJSON.name,
    VERSION: packageJSON.version,
  },
  clientPaths: {
    PUBLIC_URL: '',
    MEDIA: '/media',
  },
  paths: {
    APP_INDEX: `${ SRC }/index.js`,
    DIST,
    DIST_PUBLIC,
    FAVICON: `${ SRC_MEDIA }/favicon.png`,
    JEST: `${ ROOT }/.jest`,
    NODE_MODULES: `${ ROOT }/node_modules`,
    PACKAGE_JSON,
    ROOT,
    SRC,
    SRC_STATIC,
  },
  // Even though `SERVER_PORT` is a number in the package.json, it comes
  // through as a String, so cast it back to a number via `+`
  PORT: +process.env.npm_package_config_SERVER_PORT,
  webpack: {
    // Normally WP is only for client code, but we're utilizing the
    // `webpack-alias` plugin to simplify out pathing in files. So it's ok to
    // have a mixture of public and private paths.
    aliases: {
      COMPONENTS: `${ SRC }/components`,
      DIST_PRIVATE: `${ DIST }/private`,
      DIST_PUBLIC,
      ROOT,
      SRC,
      UTILS: `${ SRC }/utils`,
    },
    entries: {
      VENDOR: 'vendor',
      APP: 'app',
    },
    MANIFEST_NAME: 'assets-manifest.json',
  },
};

/**
 * Use `resolve` to normalize paths, so that on Windows, something like a
 * Webpack loader won't get a path like `C:\some\path/to/something` and not
 * apply itself.
 *
 * @param {Array} keys - An Array of key paths relative to the `conf` Object.
 */
const normalizePaths = (keys) => {
  keys.forEach((key) => {
    const obj = eval(`conf.${ key }`);
    Object.keys(obj).forEach((pathKey) => {
      obj[pathKey] = resolve(obj[pathKey]);
    });
  });
};
normalizePaths(['paths', 'webpack.aliases']);

module.exports = conf;
