/**
 * Sorts an Object by it's key values.
 *
 * @param {Object} obj - An Object that needs sorting.
 * @param {String} key - A nested key that should be used to sort.
 * @return {Object}
 */
export default (obj, key) => {
  const sorted = {};

  Object.keys(obj)
    .sort((a, b) => {
      const optA = obj[a][key].toLowerCase();
      const optB = obj[b][key].toLowerCase();
      if(optA < optB) return -1;
      if(optA > optB) return 1;
      return 0;
    })
    .forEach((key) => {
      sorted[key] = obj[key];
    });

  return sorted;
};