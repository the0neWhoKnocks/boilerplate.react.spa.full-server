import AsyncChunk from 'COMPONENTS/AsyncChunk';
import {
  setItemResults,
  setViewData,
} from 'STATE/actions';
import store from 'STATE/store';
import composeChunk from 'UTILS/composeChunk';
import getData from 'UTILS/getData';

// TODO - ideally this should be broken out into other files, or piped into the
// store now that Redux is hooked up.

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

const routePaths = {
  IPSUM_1: '/ipsum1',
  IPSUM_3: '/ipsum3',
  ITEM: '/view/item/',
  ROOT: '/',
  TERMS: '/terms',
};
const tokens = {
  ITEM: ':itemId',
};

// =============================================================================
// Bacon Ipsum

const baconIpsumMiddleware = (reqOpts) => (resp) => new Promise((resolve, reject) => {
  store.app.dispatch(setViewData({
    data: resp,
    reqOpts,
  }));
  resolve(resp);
});

const oneParaOpts = {
  url: 'https://baconipsum.com/api/',
  params: {
    paras: 1,
    type: 'all-meat',
  },
  cacheKey: ['url', 'paras', 'type'],
};
const threeParaOpts = {
  url: 'https://baconipsum.com/api/',
  params: {
    paras: 3,
    type: 'all-meat',
  },
  cacheKey: ['url', 'paras', 'type'],
};

const DefaultView = composeChunk({
  load: () => import(
    /* webpackChunkName: "DefaultView" */
    'COMPONENTS/views/Default'
  ),
});

const OnePara = AsyncChunk({
  chunk: DefaultView,
  reqOpts: {
    ...oneParaOpts,
    middleware: baconIpsumMiddleware(oneParaOpts),
  },
});
const ThreePara = AsyncChunk({
  chunk: DefaultView,
  reqOpts: {
    ...threeParaOpts,
    middleware: baconIpsumMiddleware(threeParaOpts),
  },
});

// =============================================================================
// Rick & Morty

const itemsOpts = {
  // all pages
  url: 'https://rickandmortyapi.com/api/character/',
  // limited set of pages
  // url: 'https://rickandmortyapi.com/api/character/?name=rick',
  params: {},
  cacheKey: ['url'],
};
const rickAndMortyMiddleware = (resp) => new Promise((resolve, reject) => {
  store.app.dispatch(setViewData({
    data: resp,
    reqOpts: itemsOpts,
  }));
  store.app.dispatch(setItemResults(resp));

  // NOTE - Errors on the Client and Server will differ due to file path
  // resolution so a hydration error is to be expected.
  // throw Error('poop'); // NOTE - left in for example, uncomment to see error view

  resolve(resp);
});
const RickAndMortyItems = AsyncChunk({
  chunk: composeChunk({
    load: () => import(
      /* webpackChunkName: "RickAndMortyCharacters" */
      'COMPONENTS/views/Items'
    ),
    type: 'ram',
  }),
  reqOpts: {
    ...itemsOpts,
    middleware: rickAndMortyMiddleware,
  },
});

const itemOpts = {
  url: `https://rickandmortyapi.com/api/character/${ tokens.ITEM }`,
  params: {},
  cacheKey: ['url'],
};
const RickAndMortyItem = AsyncChunk({
  chunk: composeChunk({
    load: () => import(
      /* webpackChunkName: "RickAndMortyCharacter" */
      'COMPONENTS/views/Item'
    ),
    type: 'ram',
  }),
  reqOpts: {
    ...itemOpts,
    middleware: (resp) => new Promise((resolve, reject) => {
      store.app.dispatch(setViewData({
        data: resp,
        reqOpts: {
          ...itemOpts,
          url: resp.url, // pass the parsed url (token replaced) so the cache key is correct
        },
      }));
      resolve(resp);
    }),
  },
});

// =============================================================================
// Set up nav data
// - This in turn, sets up the React routes

const data = {
  header: {
    navItems: [
      {
        exact: true,
        label: 'Rick & Morty',
        url: routePaths.ROOT,
        view: RickAndMortyItems,
        viewProps: {
          linkPrefix: routePaths.ITEM,
          ssr: getData,
          title: 'Rick & Morty',
        },
      },
      {
        label: 'Bacon Ipsum (SSR)',
        url: routePaths.IPSUM_1,
        view: OnePara,
        viewProps: {
          ssr: getData,
          title: 'Bacon Ipsum (1 paragraph, SSR)',
        },
      },
      {
        label: 'Bacon Ipsum',
        url: routePaths.IPSUM_3,
        view: ThreePara,
        viewProps: {
          title: 'Bacon Ipsum (3 paragraph, Client-only)',
        },
      },
    ],
  },
  footer: {
    navItems: [
      {
        label: 'Terms of Service',
        url: routePaths.TERMS,
        view: DefaultView,
        viewProps: {
          title: 'Terms of Service',
          data: [
            'Just some legal mumbo jumbo',
          ],
        },
      },
    ],
  },
};

const otherRoutes = [
  {
    url: `${ routePaths.ITEM }${ tokens.ITEM }`,
    view: RickAndMortyItem,
    viewProps: {
      ssr: getData,
      title: 'Rick & Morty Character',
    },
  },
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
  routePaths,
  tokens,
};
