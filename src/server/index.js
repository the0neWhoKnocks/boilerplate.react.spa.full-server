import express from 'express';
import compression from 'compression';
import color from 'cli-color';
import opn from 'opn';
import portscanner from 'portscanner';
import bodyParser from 'body-parser';

import appConfig from 'ROOT/conf.app';
import routes from './routes.js';

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
    const _self = this;

    Object.keys(routes.get).forEach(function(route){
      _self.expressInst.get(route, routes.get[route]);
    });
  },

  addServerListeners: function(){
    const _self = this;

    // Dynamically sets an open port, if the default is in use.
    portscanner.checkPortStatus(appConfig.PORT, '127.0.0.1', function(error, status){
      // Status is 'open' if currently in use or 'closed' if available
      switch(status){
        case 'open' : // port isn't available, so find one that is
          portscanner.findAPortNotInUse(appConfig.PORT, appConfig.PORT+20, '127.0.0.1', function(error, openPort){
            console.log(`${ color.yellow.bold('[PORT]') } ${ appConfig.PORT } in use, using ${ openPort }`);

            appConfig.PORT = openPort;

            _self.startServer();
          });
          break;

        default :
          _self.startServer();
      }
    });
  },

  onBootComplete: function(data){
    // let the user know the server is up and ready
    let msg = `${ color.green.bold('[ SERVER ]') } Running at ${ color.blue.bold(data.url) }`;

    if( isDev ){
      const getBrowser = require('UTILS/getBrowser');

      msg += `\n${ color.green.bold('[ WATCHING ]') } For changes`;

      opn(data.url, {
        app: [getBrowser.chrome(), '--incognito'],
        wait: false, // no need to wait for app to close
      });
    }

    console.log(`${ msg } \n`);
  },

  startServer: function(){
    this.server.listen(appConfig.PORT, this.onBootComplete.bind(this, {
      url: `http://localhost:${ appConfig.PORT }/`,
    }));
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
