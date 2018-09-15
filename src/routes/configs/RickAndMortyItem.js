import AsyncChunk from 'COMPONENTS/AsyncChunk';
import {
  ITEM as ITEM_ROUTE,
} from 'CONSTANTS/routePaths';
import {
  ITEM as ITEM_TOKEN,
} from 'CONSTANTS/routeTokens';
import { RickAndMortyCharacter } from 'ROUTES/shared/composedChunks';
import { rickAndMortyCharacter as middleware } from 'ROUTES/shared/middleware';

const reqOpts = {
  url: `https://rickandmortyapi.com/api/character/${ ITEM_TOKEN }`,
  params: {},
  cacheKey: ['url'],
};

const Item = AsyncChunk({
  chunk: RickAndMortyCharacter,
  reqOpts: {
    ...reqOpts,
    middleware: middleware(reqOpts),
  },
});

const ROUTE = {
  path: `${ ITEM_ROUTE }${ ITEM_TOKEN }`,
  view: Item,
  viewProps: {
    title: 'Rick & Morty Character',
  },
};

if( process.env.IS_SERVER ){
  ROUTE.handler = require('ROUTES/handlers/app').default;
  ROUTE.viewProps.ssr = require('UTILS/getData').default;
}

export default {
  get: [ ROUTE ],
};
