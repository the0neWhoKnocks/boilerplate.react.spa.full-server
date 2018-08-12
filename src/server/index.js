import { existsSync } from 'fs';
import express from 'express';
import compression from 'compression';
import portscanner from 'portscanner';
import bodyParser from 'body-parser';
import appConfig from 'ROOT/conf.app';
import log, {
  BLUE,
  BLACK_ON_GREEN,
  BLACK_ON_YELLOW,
} from 'UTILS/logger';
import routes from './routes';

const isDev = process.env.NODE_ENV === 'development';

// =============================================================================

const app = {
  init: function(){
    this.expressInst = express();
    this.server = require('http').createServer(this.expressInst);
    // enable gzip (must come before `static` assets)
    this.expressInst.use(compression());
    // serve static files from `public`
    this.expressInst.use(express.static(appConfig.paths.DIST_PUBLIC, {
      index: false, // ignore the generated index file
    }));
    // allows for reading POST data
    this.expressInst.use(bodyParser.json()); // to support JSON-encoded bodies
    this.expressInst.use(bodyParser.urlencoded({ // to support URL-encoded bodies
      extended: true,
    }));
    // allows for reading cookies
    this.expressInst.use(require('cookie-parser')());

    // bind server routes
    this.setupRoutes();
    this.addServerListeners();
  },

  setupRoutes: function(){
    // Has to come before any other routes since it's a dynamic route inserted
    // by reload, and won't resolve if any other routes are set up to handle
    // js files or there are any catch-all's.
    if(isDev) require('reload')(this.expressInst);

    // dynamically wire up routes
    Object.keys(routes).forEach(type => {
      Object.keys(routes[type]).forEach(routeKey => {
        const endpoint = routes[type][routeKey];
        this.expressInst[type](endpoint.path, endpoint.handler);
      });
    });
  },

  addServerListeners: function(){
    // Dynamically sets an open port, if the default is in use.
    portscanner.checkPortStatus(appConfig.PORT, '127.0.0.1', (error, status) => {
      // Status is 'open' if currently in use or 'closed' if available
      switch(status){
        case 'open' : // port isn't available, so find one that is
          portscanner.findAPortNotInUse(appConfig.PORT, appConfig.PORT+20, '127.0.0.1', (error, openPort) => {
            log(`${ BLACK_ON_YELLOW } PORT`, `${ appConfig.PORT } in use, using ${ openPort }`);

            appConfig.PORT = openPort;

            this.startServer();
          });
          break;

        default :
          this.startServer();
      }
    });
  },

  onBootComplete: function(data){
    // let the user know the server is up and ready
    log(`${ BLACK_ON_GREEN } SERVER`, 'Running at', `${ BLUE } ${ data.url }`);
    // spit out some dev messaging
    if( isDev ) log(`${ BLACK_ON_GREEN } WATCHING`, 'For changes.', '\n  You can go to', `${ BLUE } chrome://inspect`, 'to debug server code.');
    // spit out all the routes that have been registered
    log(`${ BLACK_ON_GREEN } ROUTES`, `\n${ require('UTILS/listRoutes').default(this.expressInst) }\n`);
  },

  startServer: function(){
    // don't start server until required files are built
    const timeout = setInterval(() => {
      const file = `${ appConfig.paths.DIST_PUBLIC }/${ appConfig.webpack.MANIFEST_NAME }`;
      const bundleCreated = existsSync(file);

      if( bundleCreated ) {
        clearInterval(timeout);

        // Sometimes the asset message prints after the server message, this
        // ensures the same order every time.
        setTimeout(() => {
          this.server.listen(appConfig.PORT, this.onBootComplete.bind(this, {
            url: `http://localhost:${ appConfig.PORT }/`,
          }));
        }, 100);
      }
      else{
        log(`${ BLACK_ON_YELLOW } WAITING`, 'for', `${ BLUE } ${ file }`, 'to be created');
      }
    }, 200);
  },
};

module.exports = app;
const args = process.argv;
if(
  // CLI won't have parent
  !module.parent
  // First arg is node executable, second arg is the .js file, the rest are user args
  && args.length >= 3
){
  if( app[args[2]] ) app[args[2]]();
}
