const noOp = () => {};
const routes = {
  get: {},
  post: {
    NOOP: {
      path: '/not/implemented',
      handler: noOp,
    },
  },
  put: {
    NOOP: {
      path: '/not/implemented',
      handler: noOp,
    },
  },
};
let catchAllHandler;

// Dynamically set up all routes
const CONFIGS_DIR = './configs';

const buildRoutes = (conf, name) => {
  Object.keys(conf).forEach(type => {
    // `types` will be `get`, `post`, etc.
    conf[type].forEach(route => {
      const transformedName = name.replace('./', '').replace('.js', '');
      // Assign the file name as the key so it can be easily accessed and
      // references stay associated through out the project in case of
      // refactors.
      routes[type][transformedName] = route;
    });
  });
};

if( process.env.IS_CLIENT ){
  // NOTE - Have to hardcode the path here, otherwise WP can't analyze the path
  // during the build.
  const configs = require.context('./configs', false, /\.js$/);
  
  configs.keys().forEach(confName => {
    const conf = configs(confName).default;
    buildRoutes(conf, confName);
  });
}
else{
  const { resolve } = require('path');
  if(process.env.IS_SERVER){
    catchAllHandler = require('ROUTES/handlers/app').default;
  }
  
  require('glob').sync('**/*.js', {
    cwd: resolve(__dirname, CONFIGS_DIR),
  })
    .forEach((confName) => {
      const conf = require(`${ CONFIGS_DIR }/${ confName }`).default;
      buildRoutes(conf, confName);
    });
}

// The `*` route comes last to ensure more specific routes go to their
// expected handler.
routes.get.CATCH_ALL = {
  path: '*',
  handler: catchAllHandler,
};

const {
  get,
  post,
  put,
} = routes;
export {
  get,
  post,
  put,
};
