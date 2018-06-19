const eslintFormatter = require('react-dev-utils/eslintFormatter');
const appConfig = require('../conf.app');
const { hashedName } = require('./vars');

/**
 * Setup all the module rules as Objects so they can easily be inserted in any
 * order, and to allow for easy manipulation of their props.
 */
module.exports = {
  babelLoader: {
    test: /\.jsx?$/,
    include: appConfig.paths.SRC,
    loader: require.resolve('babel-loader'),
    options: {},
  },
  eslintLoader: {
    test: /\.jsx?$/,
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
    include: appConfig.paths.SRC,
  },
  fileLoader: {
    // Exclude `js` files to keep "css" loader working as it injects
    // it's runtime that would otherwise be processed through "file" loader.
    // Also exclude `html` and `json` extensions so they get processed
    // by webpacks internal loaders.
    exclude: [/\.js$/, /\.html$/, /\.json$/],
    loader: require.resolve('file-loader'),
    options: {
      name: `${ appConfig.clientPaths.MEDIA }/${ hashedName }.[ext]`,
    },
  },
  urlLoader: {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: `${ appConfig.clientPaths.MEDIA }/${ hashedName }.[ext]`,
    },
  },
};
