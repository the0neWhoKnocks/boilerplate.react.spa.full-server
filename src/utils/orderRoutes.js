import sortObjByValue from './sortObjByValue';

/**
 * Orders the routes alphabetically while also maintaining an order that ensures
 * routes are handled as expected.
 *
 * @param {Object} routes - The current routes
 */
export default (routes) => {
  let sorted = {};
  
  Object.keys(routes).forEach(type => {
    sorted[type] = sortObjByValue(routes[type], 'path');
    const currGroup = sorted[type];
    
    // The `*` path always needs to come last since it'll catch everything.
    let starRouteId;
    let starRoute;
    Object.keys(currGroup).forEach(routeId => {
      const route = currGroup[routeId];
      
      if(route.path === '*'){
        starRouteId = routeId;
        starRoute = route;
        delete currGroup[routeId];
      }
    });
    
    if(starRoute) currGroup[starRouteId] = starRoute;
  });
  
  return sorted;
};