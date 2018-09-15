import { get as APP_ROUTES } from 'ROUTES';

// =============================================================================
// Set up nav data
// This in turn will set up the React routes via the `routes` passed to the
// `Main` component.

const {
  BaconIpsumSingle,
  BaconIpsumMultiple,
  RickAndMortyItems,
  Terms,
} = APP_ROUTES;

export const headerNavItems = [
  RickAndMortyItems,
  BaconIpsumSingle,
  BaconIpsumMultiple,
];

export const footerNavItems = [
  Terms,
];
