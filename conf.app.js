const path = require('path');
const url = require('url');

const ROOT = path.resolve(__dirname);
const SRC = path.resolve(ROOT, 'src');
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
    appBuild: path.resolve(ROOT, 'build'),
    appHtml: path.resolve(ROOT, 'public/index.html'),
    appIndexJs: path.resolve(ROOT, 'src/index.js'),
    appNodeModules: path.resolve(ROOT, 'node_modules'),
    appPackageJson: path.resolve(ROOT, 'package.json'),
    appPublic: path.resolve(ROOT, 'public'),
    JEST: path.resolve(ROOT, '.jest'),
    publicUrl: getPublicUrl(path.resolve(ROOT, 'package.json')),
    ROOT,
    SRC,
    servedPath: getServedPath(path.resolve(ROOT, 'package.json')),
    testsSetup: path.resolve(ROOT, 'src/setupTests.js'),
    yarnLockFile: path.resolve(ROOT, 'yarn.lock'),
  },
  webpack: {
    paths: {
      COMPONENTS: path.resolve(ROOT, 'src/components'),
      ROOT,
      SRC,
    }
  }
};
