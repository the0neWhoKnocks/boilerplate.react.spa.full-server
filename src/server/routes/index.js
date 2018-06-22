import catchAll from './catchAll';

module.exports = {
  get: {
    // NOTE - add any other paths above the `*` catch-all route,
    // like static assets, or API's

    '/view/item/:itemId': catchAll,
    // route everything else to the app
    '*': catchAll,
  },
};
