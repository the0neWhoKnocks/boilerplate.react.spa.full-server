const appConfig = require('./conf.app');

const conf = {
  collectCoverageFrom: [
    'src/**/*.{js}'
  ],
  moduleFileExtensions: [ 'js', 'json', 'node' ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web'
  },
  setupFiles: [
    `${ appConfig.paths.SRC }/polyfills.js`
  ],
  testEnvironment: 'node',
  testMatch: [
    `${ appConfig.paths.ROOT }/src/**/?(*.)test.js`
  ],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js)$': `${ appConfig.paths.ROOT }/node_modules/babel-jest`,
    '^.+\\.css$': `${ appConfig.paths.JEST }/cssTransform.js`,
    '^(?!.*\\.(js|css|json)$)': `${ appConfig.paths.JEST }/fileTransform.js`
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
  ],
};

module.exports = conf;
