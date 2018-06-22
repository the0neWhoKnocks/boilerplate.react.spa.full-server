/**
 * Generates a cache key based on the properties of the request.
 *
 * @param {Object} reqOpts - The request options.
 * @param {Array} [reqOpts.cacheKey] - Array of strings that the key will be built from
 * @param {Object} reqOpts.params - The params needed for a GET or POST
 * @param {String} reqOpts.url - The request URL
 * @return {String}
 */
export default (reqOpts) => {
  let cacheKey = reqOpts.url;

  if(reqOpts.cacheKey){
    reqOpts.cacheKey.forEach((key) => {
      if(key !== 'url') cacheKey += `-${ reqOpts.params[key] }`;
    });
  }

  return cacheKey;
};
