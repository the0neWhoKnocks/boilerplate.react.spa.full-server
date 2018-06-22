import log, {
  BLACK_ON_GREEN,
  BLUE,
} from 'UTILS/logger';

/**
 * Logs out info about the request
 *
 * @param {Object} next - The route callback
 * @param {Object} req - The request
 * @param {Object} res - The response
 */
export default (next, req, res) => {
  const args = [`${ BLACK_ON_GREEN } ROUTE`, 'matched:', `${ BLUE } ${ req.route.path }`];
  // add on params if token was replaced
  if(
    req.route.path !== '*'
    && req._parsedUrl.pathname !== req.route.path
  ) args.push(`\n${ JSON.stringify(req.params, null, 2) }`);

  log(...args);
  next(req, res);
};
