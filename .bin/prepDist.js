const fs = require('fs-extra');
const appConfig = require('../conf.app');

function prepPublic() {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  fs.emptyDirSync(appConfig.paths.DIST_PUBLIC);
  // Merge with the public folder
  fs.copySync(appConfig.paths.SRC_PUBLIC, appConfig.paths.DIST_PUBLIC, {
    dereference: true,
    filter: file => file !== appConfig.paths.INDEX_TEMPLATE,
  });
}

module.exports = prepPublic;
