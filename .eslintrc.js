module.exports = {
  extends: '@noxx',
  parser: 'babel-eslint', // needed to get dynamic imports linting correctly
  rules: {
    'require-jsdoc': 0,
    'react/display-name': [
      0,
      {
        // needed when using `babel-eslint`, removes errors for missing
        // display-name on arrow functions
        ignoreTranspilerName: true
      }
    ]
  }
};
