import catchAll from './catchAll';

module.exports = {
  get: {
    // NOTE - add any other paths above the `*` catch-all route,
    // like static assets, or API's

    GET_ITEM: {
      path: '/view/item/:itemId',
      handler: catchAll,
    },
    // route everything else to the app
    GET_CATCH_ALL: {
      path: '*',
      handler: catchAll,
    },
  },

  post: {
    POST_TEST: {
      path: '/test/fu',
      handler: () => {},
    },
  },
};
