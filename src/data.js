import BaconIpsumSingle from 'ROUTES/BaconIpsumSingle';
import BaconIpsumMultiple from 'ROUTES/BaconIpsumMultiple';
import RickAndMortyItem from 'ROUTES/RickAndMortyItem';
import RickAndMortyItems from 'ROUTES/RickAndMortyItems';
import Terms from 'ROUTES/Terms';

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
// - This in turn, sets up the React routes

const data = {
  header: {
    navItems: [
      RickAndMortyItems,
      BaconIpsumSingle,
      BaconIpsumMultiple,
    ],
  },
  footer: {
    navItems: [
      Terms,
    ],
  },
};

const otherRoutes = [
  RickAndMortyItem,
];

const headerProps = {
  navItems: data.header.navItems,
};
const mainProps = {
  routes: [
    ...data.header.navItems,
    ...data.footer.navItems,
    ...otherRoutes,
  ],
};
const footerProps = {
  navItems: data.footer.navItems,
};

export {
  footerProps,
  headerProps,
  mainProps,
};
