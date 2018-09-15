import AsyncChunk from 'COMPONENTS/AsyncChunk';
import { ROOT, ITEM } from 'CONSTANTS/routePaths';
import { RickAndMortyCharacters } from 'ROUTES/shared/composedChunks';
import { rickAndMortyCharacters as middleware } from 'ROUTES/shared/middleware';

const reqOpts = {
  // all pages
  url: 'https://rickandmortyapi.com/api/character/',
  // limited set of pages
  // url: 'https://rickandmortyapi.com/api/character/?name=rick',
  params: {},
  cacheKey: ['url'],
};

const Items = AsyncChunk({
  chunk: RickAndMortyCharacters,
  reqOpts: {
    ...reqOpts,
    middleware: middleware(reqOpts),
  },
});

const ROUTE = {
  exact: true,
  label: 'Rick & Morty',
  path: ROOT,
  view: Items,
  viewProps: {
    linkPrefix: ITEM,
    title: 'Rick & Morty',
  },
};

if( process.env.IS_SERVER ){
  ROUTE.handler = require('ROUTES/handlers/app').default;
  ROUTE.viewProps.ssr = require('UTILS/getData').default;
}

export default {
  get: [ ROUTE ],
};
