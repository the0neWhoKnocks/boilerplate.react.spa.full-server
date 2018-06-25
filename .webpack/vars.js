const appConfig = require('../conf.app');

const hashLength = 5;
// list of tokens - https://github.com/webpack-contrib/css-loader/issues/226#issuecomment-334467260
const hashedName = `[name]_[chunkhash:${ hashLength }]`;
const WEBPACK_ASSETS_URL = process.env.WEBPACK_ASSETS_URL;

// Using local ip address in DEV MODE so that developers can share local
// instances across local network. If left to localhost OR 127.0.0.1 OR
// 0.0.0.0, this would not allow devs to see each others instances as
// bundles are served not from the same IP as the rest of the application.
if(
  !WEBPACK_ASSETS_URL
  && process.env.NODE_ENV === 'development'
){
  const os = require('os');
  const ifaces = os.networkInterfaces();
  const localIP = [];

  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      if( iface.family !== 'IPv4' || iface.internal !== false ) return;
      localIP.push(iface.address);
      return localIP;
    });
  });

  process.env.WEBPACK_ASSETS_URL = `//${ localIP[0] }:${ appConfig.webpack.PORT }/`;
}

module.exports = {
  hashLength,
  hashedName,
};
