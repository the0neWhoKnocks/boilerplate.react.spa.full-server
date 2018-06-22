import getSSRData from './getSSRData';
import replaceUrlToken from './replaceUrlToken';

/**
 * Loops over the data Objects provided to the Shell and finds views that match
 * the current page URL, and loads their data if they have an `ssr` prop.
 *
 * @param {String} url - The request URL
 * @param {Object} params - Params matched from route - `/some/path/:varName`
 * @param {Array} arr - The data Objects
 * @return {Promise}
 */
const awaitSSRData = (store, url, params, arr) => {
  const iterate = (item, promises) => {
    if(Array.isArray(item)){
      item.forEach((i) => {
        iterate(i, promises);
      });
    }
    else if(typeof item === 'object'){
      Object.keys(item).forEach((key) => {
        const i = item[key];

        if(Array.isArray(i)) iterate(i, promises);
        else if(
          key === 'view'
          && url === replaceUrlToken(params, item.url)
          && item.viewProps.ssr
        ) {
          promises.push(getSSRData(store, item.viewProps.ssr, params, i.reqOpts));
        }
      });
    }
  };

  const promises = [];
  arr.forEach((obj) => iterate(obj, promises));

  return (promises.length)
    ? Promise.all(promises)
    : Promise.resolve();
};

export default awaitSSRData;
