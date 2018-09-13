/**
 * Builds out all routes based on their methods (get, post, etc) and maintains
 * an order that ensures routes are handled as expected.
 *
 * @param {Object} conf - A route config
 * @param {String} name - The name of the route config file
 * @param {Object} routes - The current routes
 */
export default (conf, name, routes) => {
  Object.keys(conf).forEach(type => {
    // `types` will be `get`, `post`, etc.
    conf[type].forEach(route => {
      const transformedName = name.replace('./', '').replace('.js', '');
      // Assign the file name as the key so it can be easily accessed and
      // references stay associated through out the project in case of
      // refactors.
      routes[type][transformedName] = route;
    });
  });
};