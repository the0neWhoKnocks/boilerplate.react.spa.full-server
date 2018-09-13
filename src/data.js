import { get as CLIENT_ROUTES } from 'ROUTES';

// =============================================================================
// Print out more verbose errors if a Promise errors without a `catch`.
// Shouldn't happen often, but when integrating new services or tools it can
// come in handy.

if(process.env.IS_SERVER){
  const {
    default: logger,
    BLACK_ON_RED,
  } = require('UTILS/logger');

  process.on('unhandledRejection', (error) => {
    logger(
      `${ BLACK_ON_RED } ERROR`,
      (error && error.stack) ? error.stack : JSON.stringify(error)
    );
  });
}

// =============================================================================
// Set up nav data
// This in turn will set up the React routes via the `routes` passed to the
// `Main` component.

const {
  BaconIpsumSingle,
  BaconIpsumMultiple,
  RickAndMortyItems,
  Terms,
} = CLIENT_ROUTES;
const headerProps = {
  navItems: [
    RickAndMortyItems,
    BaconIpsumSingle,
    BaconIpsumMultiple,
  ],
};
const mainProps = {
  routes: Object.keys(CLIENT_ROUTES).map((key) => CLIENT_ROUTES[key]),
};
const footerProps = {
  navItems: [
    Terms,
  ],
};

export {
  footerProps,
  headerProps,
  mainProps,
};
