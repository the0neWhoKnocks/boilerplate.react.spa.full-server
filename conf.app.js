const path = require('path');
const packageJSON = require('./package.json');

const ROOT = path.resolve(__dirname);
const SRC = `${ ROOT }/src`;
const SRC_PUBLIC = `${ SRC }/public`;
const SRC_MEDIA = `${ SRC_PUBLIC }/media`;
const PACKAGE_JSON = `${ ROOT }/package.json`;


module.exports = {
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
    PORT: +process.env.npm_package_config_SERVER_PORT,
  },
};
