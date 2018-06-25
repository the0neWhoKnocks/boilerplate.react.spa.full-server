import ViewHOC from 'COMPONENTS/ViewHOC';
import DefaultView from 'COMPONENTS/views/Default';
import ItemsView from 'COMPONENTS/views/Items';
import ItemView from 'COMPONENTS/views/Item';
import getData from 'UTILS/getData';
import { setViewData } from 'STATE/actions';

// TODO - ideally this should be broken out into other files, or piped into the
// store now that Redux is hooked up.

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

const baconIpsumMiddleware = (reqOpts) => (store) => (resp) => new Promise((resolve, reject) => {
  store.dispatch(setViewData({
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

const OnePara = ViewHOC({
  reqOpts: {
    ...oneParaOpts,
    middleware: baconIpsumMiddleware(oneParaOpts),
  },
  View: DefaultView,
});
const ThreePara = ViewHOC({
  reqOpts: {
    ...threeParaOpts,
    middleware: baconIpsumMiddleware(threeParaOpts),
  },
  View: DefaultView,
});

// =============================================================================
// Rick & Morty

const itemsOpts = {
  url: 'https://rickandmortyapi.com/api/character/',
  params: {},
  cacheKey: ['url'],
};
const rickAndMortyMiddleware = (store) => (resp) => new Promise((resolve, reject) => {
  store.dispatch(setViewData({
    data: resp.results,
    reqOpts: itemsOpts,
  }));
  resolve(resp);
});
const RickAndMortyItems = ViewHOC({
  reqOpts: {
    ...itemsOpts,
    middleware: rickAndMortyMiddleware,
  },
  View: ItemsView,
});

const itemOpts = {
  url: `https://rickandmortyapi.com/api/character/${ tokens.ITEM }`,
  params: {},
  cacheKey: ['url'],
};
const RickAndMortyItem = ViewHOC({
  reqOpts: {
    ...itemOpts,
    middleware: (store) => (resp) => new Promise((resolve, reject) => {
      store.dispatch(setViewData({
        data: resp,
        reqOpts: {
          ...itemOpts,
          url: resp.url, // pass the parsed url (token replaced) so the cache key is correct
        },
      }));
      resolve(resp);
    }),
  },
  View: ItemView,
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
