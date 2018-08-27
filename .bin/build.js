// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => { throw err; });

require('colors');
const webpack = require('webpack');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
const config = require('../.webpack/conf.webpack');
const appConfig = require('../conf.app');
const prepDist = require('./prepDist');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if(err){
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if(messages.errors.length){
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if(messages.errors.length > 1){
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if(
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ){
        const msg = '\nTreating warnings as errors because process.env.CI = true.'
                    +'\nMost CI servers set it automatically.\n';
        console.log(msg.yellow);
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

// Warn and crash if required files are missing
if(!checkRequiredFiles([appConfig.paths.APP_INDEX])){
  process.exit(1);
}

if( process.env.NODE_ENV === 'development' ){
  webpack(config, (err, stats) => {
    if( err ) throw err;
    console.log(stats.toString(config.stats));
  });
}
else{
  // First, read the current file sizes in build directory.
  // This lets us display how much they changed later.
  measureFileSizesBeforeBuild(config.output.path)
    .then(previousFileSizes => {
      prepDist();
      // Start the webpack build
      return build(previousFileSizes);
    })
    .then(
      ({ stats, previousFileSizes, warnings }) => {
        if(warnings.length){
          const msg = 'Compiled with warnings.'.yellow
                      + '\n'+ warnings.join('\n\n')
                      + `\nSearch for the keywords ${ 'keywords'.yellow.underline } to learn more about each warning.`
                      + `\nTo ignore, add ${ '// eslint-disable-next-line'.cyan } to the line before.\n`;

          console.log(msg);
        }
        else{
          console.log('Compiled successfully.\n'.green);
        }

        console.log('File sizes after gzip:\n');
        printFileSizesAfterBuild(
          stats,
          previousFileSizes,
          '',
          WARN_AFTER_BUNDLE_GZIP_SIZE,
          WARN_AFTER_CHUNK_GZIP_SIZE
        );
        console.log();
      },
      err => {
        console.log('Failed to compile.\n'.red);
        printBuildError(err);
        process.exit(1);
      }
    );
}
