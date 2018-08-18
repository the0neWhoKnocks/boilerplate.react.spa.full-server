import replaceUrlToken from './replaceUrlToken';

/**
 * Executes the provided function to get data, then assigns that data to the
 * provided Object so it's then available to the View.
 *
 * @param {Function} fn - The function that returns the View data.
 * @param {Object} params - Params matched from route - `/some/path/:varName`
 * @param {Object} reqOpts - The data needed to make the request.
 * @return {Promise}
 */
const getSSRData = (fn, params, reqOpts) => {
  const opts = { ...reqOpts };
  opts.url = replaceUrlToken(params, opts.url);
  
  return fn(opts)
    .then((resp) => {
      console.debug('SSR - data', resp);
    })
    .catch((err) => {
      console.error(err);
    });
};

export default getSSRData;
