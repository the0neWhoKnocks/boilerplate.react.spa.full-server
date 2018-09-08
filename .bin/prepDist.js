const fs = require('fs-extra');
const appConfig = require('../conf.app');

async function prepDist() {
  try {
    // Create directories if they don't exist
    await fs.ensureDir(appConfig.paths.DIST);
    await fs.ensureDir(appConfig.paths.DIST_PRIVATE);
    await fs.ensureDir(appConfig.paths.DIST_PUBLIC);

    // Copy over any top-level files that are needed
    await fs.copy(
      `${ appConfig.paths.ROOT }/conf.app.js`,
      `${ appConfig.paths.DIST }/conf.app.js`
    );
    await fs.copy(
      `${ appConfig.paths.ROOT }/package.json`,
      `${ appConfig.paths.DIST }/package.json`
    );

    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    await fs.emptyDir(appConfig.paths.DIST_PRIVATE);
    await fs.emptyDir(appConfig.paths.DIST_PUBLIC);
    
    // Merge with the public folder
    await fs.copy(appConfig.paths.SRC_STATIC, appConfig.paths.DIST_PUBLIC, {
      dereference: true,
      // Can be used to filter out any files that shouldn't be copied.
      // filter: file => file !== appConfig.paths.INDEX_TEMPLATE,
    });
  }
  catch(err) { console.error(err); }
}

module.exports = prepDist;

// CLI won't have parent
if(!module.parent) prepDist();
