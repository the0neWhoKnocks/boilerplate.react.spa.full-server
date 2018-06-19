import axios from 'axios';

/**
 * A wrapper for whatever XHR tool you need to request data.
 *
 * @param {Object} reqOpts - The options required to make your request.
 * @return {Promise}
 */
export default (reqOpts) => {
  const { body, params, url } = reqOpts;
  let { method } = reqOpts;
  let reqData;

  if( url ){
    const reqArgs = [url];

    // Default to GET if nothing was passed
    if( !method ) method = 'GET';
    // GETs require a `params` prop
    if( params ) reqData = { params };
    // POSTs take whatever Object is passed
    if( body ) reqData = body;
    // only add data to the call if it was provided
    if( reqData ) reqArgs.push(reqData);

    return axios[method.toLowerCase()].apply(null, reqArgs);
  }
};
