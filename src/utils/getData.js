import axios from 'axios';
import { getViewData } from 'STATE/selectors';
import genCacheKey from 'UTILS/genCacheKey';

/**
 * A wrapper for whatever XHR tool you need to request data.
 *
 * @param {Object} store - The app's store.
 * @param {Object} reqOpts - The options required to make your request.
 * @param {Array} [reqOpts.cacheKey] - Array of strings that the key will be built from
 * @param {Function} reqOpts.middleware - A function that will transform the response data before it's returned
 * @param {Object} reqOpts.params - The params needed for a GET or POST
 * @param {String} reqOpts.url - The request URL
 * @return {Promise}
 */
export default (store, reqOpts) => {
  const { body, params, url } = reqOpts;
  let { method } = reqOpts;
  let reqData;

  if( url ){
    const viewData = getViewData(store.getState(), genCacheKey(reqOpts));
    if( viewData ) return Promise.resolve(viewData);

    const reqArgs = [url];

    // Default to GET if nothing was passed
    if( !method ) method = 'GET';
    // GETs require a `params` prop
    if( params ) reqData = { params };
    // POSTs take whatever Object is passed
    if( body ) reqData = body;
    // only add data to the call if it was provided
    if( reqData ) reqArgs.push(reqData);

    let reqPromise = axios[method.toLowerCase()].apply(null, reqArgs)
      // axios always returns the response data in a `data` prop, so lets
      // remove one level of parsing.
      .then((resp) => resp.data);

    return (reqOpts.middleware)
      ? reqPromise.then(reqOpts.middleware(store))
      : reqPromise;
  }
};
