/**
 * [description]
 *
 * @param {[type]} path
 * @param {[type]} dir
 * @return {[type]}
 */
export default (path, dir) => {
  if(process.env.IS_SERVER){
    const { resolve } = require('path');
    return require( resolve(dir, path) ).default;
  }
  else{
    return null;
  }
};
