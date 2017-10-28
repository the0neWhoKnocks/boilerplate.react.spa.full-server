var path = require('path');

var _ROOT = path.resolve(__dirname);

module.exports = {
  paths: {
    COMPONENTS: path.resolve(_ROOT, './src/components'),
    ROOT: _ROOT,
    SRC: path.resolve(_ROOT, './src')
  }
};
