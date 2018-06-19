/**
 * Executes the provided function to get data, then assigns that data to the
 * provided Object so it's then available to the View.
 *
 * @param {Function} fn - The function that returns the View data.
 * @param {Object} reqOpts - The data needed to make the request.
 * @param {Object} obj - The Object the response data will be assigned to.
 * @param {String} objKey - The key/prop of the Object that the data will be assigned to.
 * @return {Promise}
 */
const getSSRData = (fn, reqOpts, obj, objKey) => {
  return fn(reqOpts)
    .then((resp) => {
      console.debug('SSR - data', resp.data);
      obj[objKey] = resp.data;
    })
    .catch((err) => {
      console.error(err);
    });
};

export default getSSRData;
