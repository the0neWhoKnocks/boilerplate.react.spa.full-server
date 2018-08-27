const extend = require('extend');
const conf = require('./conf.base');
const moduleRules = require('./moduleRules');
const appConfig = require('../conf.app.js');

let alteredConf, alteredModuleRules;

// Production build
if(process.env.NODE_ENV === 'production'){
  const prodConf = require('./conf.prod');
  alteredConf = prodConf.conf;
  alteredModuleRules = prodConf.moduleRules;
}
// Dev build
else{
  const devConf = require('./conf.dev');
  alteredConf = devConf.conf;
  alteredModuleRules = devConf.moduleRules;
}

// extend configurations based on env
alteredConf.plugins = conf.plugins.concat(alteredConf.plugins);
if( alteredConf.entry ){
  // entry items can be Arrays, so combine before extend
  Object.keys(conf.entry).forEach((key) => {
    if( alteredConf.entry[key] ){
      alteredConf.entry[key] = conf.entry[key].concat(alteredConf.entry[key]);
    }
  });
}
extend(true, conf, alteredConf);
extend(true, moduleRules, alteredModuleRules);

// -- Add any remaining entries --
// We include the app code last so that if there is a runtime error during
// initialization, it doesn't blow up the WebpackDevServer client, and
// changing JS code would still trigger a refresh.
conf.entry[appConfig.webpack.entries.APP].push(
  appConfig.paths.APP_INDEX,
);

// Ensure module loader order, along with any prod/dev augmentations.
conf.module.rules = [
  // First, run the linter.
  // It's important to do this before Babel processes the JS.
  moduleRules.eslintLoader,
  // Process JS with Babel.
  moduleRules.babelLoader,
  {
    // "oneOf" will traverse all following loaders until one will
    // match the requirements. When no loader matches it will fall
    // back to the "file" loader at the end of the loader list.
    oneOf: [
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      moduleRules.urlLoader,
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      // This loader doesn't use a "test" so it will catch all modules
      // that fall through the other loaders.
      moduleRules.fileLoader,
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
];

// Add paths to webpack as alias'. This will allow us to `import` or `require` a
// path via a constant rather than having to use `../../etc/`.
for(let alias in appConfig.webpack.aliases){
  conf.resolve.alias[alias] = appConfig.webpack.aliases[alias];
}

module.exports = conf;
