/**
 * Replace tokens in API calls with what was matched from the server
 *
 * @param {Object} params - Any vars extracted from URL `/path/:token`
 * @param {String} url - The URL used to match requests `/some/path/:token`
 * @return {String}
 */
export default (params, url) => {
  const paramKeys = Object.keys(params);
  let ret = url;

  if(paramKeys.length){
    paramKeys.forEach((token) => {
      ret = ret.replace(`:${ token }`, params[token]);
    });
  }

  return ret;
};
