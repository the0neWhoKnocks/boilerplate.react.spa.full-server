const path = require('path');
const url = require('url');
const packageJSON = require('./package.json');

const ROOT = path.resolve(__dirname);
const SRC = path.resolve(ROOT, 'src');
const PUBLIC_URL = process.env.PUBLIC_URL;
const PACKAGE_JSON = path.resolve(ROOT, 'package.json');
const publicURL = PUBLIC_URL || require(PACKAGE_JSON).homepage;
/**
 * We use `PUBLIC_URL` environment variable or "homepage" field to infer
 * "public path" at which the app is served.
 * Webpack needs to know it to put the right <script> hrefs into HTML even in
 * single-page apps that may serve index.html for nested URLs like /todos/42.
 * We can't use a relative path in HTML because we don't want to load something
 * like /todos/42/static/js/bundle.7289d.js. We have to know the root.
 */
const servedUrl = (publicURL) ? url.parse(publicURL).pathname : '/';
const servedPath = ( !servedUrl.endsWith('/') ) ? `${ servedUrl }/` : servedUrl;

module.exports = {
  app: {
    NAME: packageJSON.name,
    VERSION: packageJSON.version,
  },
  clientPaths: {
    PUBLIC_URL: '',
    STATIC_MEDIA: '/static/media',
  },
  paths: {
    APP_BUILD: path.resolve(ROOT, 'build'),
    APP_HTML: path.resolve(ROOT, 'public/index.html'),
    APP_INDEX: path.resolve(ROOT, 'src/index.js'),
    FAVICON: path.resolve(ROOT, 'public/static/media/favicon.png'),
    JEST: path.resolve(ROOT, '.jest'),
    NODE_MODULES: path.resolve(ROOT, 'node_modules'),
    PACKAGE_JSON: PACKAGE_JSON,
    PUBLIC: path.resolve(ROOT, 'public'),
    PUBLIC_URL: publicURL,
    ROOT,
    SERVED_PATH: servedPath,
    SRC,
    YARN_LOCK: path.resolve(ROOT, 'yarn.lock'),
  },
  webpack: {
    aliases: {
      COMPONENTS: path.resolve(ROOT, 'src/components'),
      ROOT,
      SRC,
    },
    PORT: 3001,
  },
};
