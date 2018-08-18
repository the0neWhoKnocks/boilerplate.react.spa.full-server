module.exports = {
  extends: '@noxx',
  parser: 'babel-eslint', // needed to get dynamic imports linting correctly
  rules: {
    'require-jsdoc': 0,
  }
};
