const { resolve } = require('path');
const packageJSON = require('./package.json');

const ROOT = resolve(__dirname);
const SRC = `${ ROOT }/src`;
const SRC_PUBLIC = `${ SRC }/public`;
const SRC_MEDIA = `${ SRC_PUBLIC }/media`;
const PACKAGE_JSON = `${ ROOT }/package.json`;

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
    DIST_PUBLIC: `${ ROOT }/public`,
    FAVICON: `${ SRC_MEDIA }/favicon.png`,
    INDEX_TEMPLATE: `${ SRC_PUBLIC }/index_template.html`,
    JEST: `${ ROOT }/.jest`,
    NODE_MODULES: `${ ROOT }/node_modules`,
    PACKAGE_JSON: PACKAGE_JSON,
    ROOT,
    SRC,
    SRC_PUBLIC: SRC_PUBLIC,
  },
  webpack: {
    aliases: {
      COMPONENTS: `${ SRC }/components`,
      ROOT,
      SRC,
    },
    // Even though `SERVER_PORT` is a number in the package.json, it comes
    // through as a String, so cast it back to a number via `+`
    PORT: +process.env.npm_package_config_SERVER_PORT,
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
