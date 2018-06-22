import { existsSync } from 'fs';
import express from 'express';
import compression from 'compression';
import color from 'cli-color';
import portscanner from 'portscanner';
import bodyParser from 'body-parser';
import appConfig from 'ROOT/conf.app';
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

    // bind server routes
    this.setupRoutes();
    this.addServerListeners();
  },

  setupRoutes: function(){
    // Has to come before any other routes since it's a dynamic route inserted
    // by reload, and won't resolve if any other routes are set up to handle
    // js files or there are any catch-all's.
    if(isDev) require('reload')(this.expressInst);

    Object.keys(routes.get).forEach((route) => {
      this.expressInst.get(route, routes.get[route]);
    });
  },

  addServerListeners: function(){
    // Dynamically sets an open port, if the default is in use.
    portscanner.checkPortStatus(appConfig.PORT, '127.0.0.1', (error, status) => {
      // Status is 'open' if currently in use or 'closed' if available
      switch(status){
        case 'open' : // port isn't available, so find one that is
          portscanner.findAPortNotInUse(appConfig.PORT, appConfig.PORT+20, '127.0.0.1', (error, openPort) => {
            console.log(`${ color.yellow.bold('[PORT]') } ${ appConfig.PORT } in use, using ${ openPort }`);

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
    let msg = `${ color.green.bold.inverse(' SERVER ') } Running at ${ color.blue.bold(data.url) }`;
    if( isDev ) msg += `\n${ color.green.bold.inverse(' WATCHING ') } For changes.\n  - You can go to ${ color.blue.bold('chrome://inspect') } to debug server code.`;

    msg += `\n${ color.green.bold.inverse(' ROUTES ') }\n${ require('UTILS/listRoutes').default(this.expressInst) }`;

    console.log(`${ msg } \n`);
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
        console.log(`${ color.yellow.bold.inverse(' WAITING ') } for ${ color.blue.bold(file) } to be created`);
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
