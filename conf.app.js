const path = require('path');
const url = require('url');

const _ROOT = path.resolve(__dirname);
const PUBLIC_URL = process.env.PUBLIC_URL;

function ensureSlash(path) {
  const hasSlash = path.endsWith('/');

  return ( !hasSlash ) ? `${path}/` : path;
}

function getPublicUrl(appPackageJson){
  return PUBLIC_URL || require(appPackageJson).homepage;
}

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = (publicUrl) ? url.parse(publicUrl).pathname : '/';
  return ensureSlash(servedUrl, true);
}

module.exports = {
  paths: {
    appBuild: path.resolve(_ROOT, 'build'),
    appHtml: path.resolve(_ROOT, 'public/index.html'),
    appIndexJs: path.resolve(_ROOT, 'src/index.js'),
    appPackageJson: path.resolve(_ROOT, 'package.json'),
    appPublic: path.resolve(_ROOT, 'public'),
    appSrc: path.resolve(_ROOT, 'src'),
    yarnLockFile: path.resolve(_ROOT, 'yarn.lock'),
    testsSetup: path.resolve(_ROOT, 'src/setupTests.js'),
    appNodeModules: path.resolve(_ROOT, 'node_modules'),
    publicUrl: getPublicUrl(path.resolve(_ROOT, 'package.json')),
    servedPath: getServedPath(path.resolve(_ROOT, 'package.json')),
  },
  webpack: {
    paths: {
      COMPONENTS: path.resolve(_ROOT, 'src/components'),
      ROOT: _ROOT,
      SRC: path.resolve(_ROOT, 'src'),
    }
  }
};
