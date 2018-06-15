const chalk = require('chalk');
const clearConsole = require('react-dev-utils/clearConsole');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

const isInteractive = process.stdout.isTTY;

/**
 * [customCompiler description]
 *
 * @param {[type]} webpack
 * @param {[type]} webpackConfig
 * @param {[type]} appName
 * @param {[type]} urls
 * @return {[type]}
 */
function customCompiler(webpack, webpackConfig, appName, urls){
  let compiler;

  try {
    compiler = webpack(webpackConfig);
  }
  catch(err){
    console.log(chalk.red('Failed to compile.'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  let isFirstCompile = true;

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', stats => {
    if( isInteractive ){
      clearConsole();
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const outputJSON = stats.toJson({}, true);
    const messages = formatWebpackMessages(outputJSON);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if( isSuccessful ){
      if( isInteractive || isFirstCompile ){
        const bundles = [];
        const url = webpackConfig.output.publicPath;

        Object.keys(outputJSON.assetsByChunkName).forEach((key) => {
          const bundle = outputJSON.assetsByChunkName[key];
          bundles.push(`http:${ url }${ bundle[0] }`);
        });
        
        console.log(chalk.green("\n Bundles being served from memory:\n  ") + bundles.join("\n  ")); // eslint-disable-line
      }
    }

    isFirstCompile = false;

    // If errors exist, only show errors.
    if( messages.errors.length ){
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if( messages.errors.length > 1 ){
        messages.errors.length = 1;
      }
      console.log(chalk.red('Failed to compile.\n'));
      console.log(messages.errors.join('\n\n'));
      return;
    }

    // Show warnings if no errors were found.
    if( messages.warnings.length ){
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(messages.warnings.join('\n\n'));

      // Teach some ESLint tricks.
      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      );
      console.log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n'
      );
    }
  });

  return compiler;
}

module.exports = customCompiler;
