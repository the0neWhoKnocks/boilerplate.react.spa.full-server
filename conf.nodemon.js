const { writeFileSync } = require('fs');
const appConfig = require('./conf.app');

const conf = {
  execMap: {
    js: 'babel-node',
  },
  ignoreRoot: [
    '.git',
  ],
  // uncomment `verbose` to check things like what files are being watched
  // verbose: true,
  watch: [
    // detects server changes
    `${ appConfig.paths.DIST_PRIVATE }/server`,
    `${ appConfig.paths.DIST_PRIVATE }/data.js`,
    // detects changes from app
    `${ appConfig.paths.DIST_PUBLIC }/assets-manifest.json`,
  ],
};

try {
  writeFileSync('/tmp/nodemon.json', `${ JSON.stringify(conf, null, 2) }\n`);
}
catch(err) { throw err; }
