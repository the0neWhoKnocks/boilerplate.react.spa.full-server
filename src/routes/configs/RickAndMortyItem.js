import AsyncChunk from 'COMPONENTS/AsyncChunk';
import {
  ITEM as ITEM_ROUTE,
} from 'CONSTANTS/routePaths';
import {
  ITEM as ITEM_TOKEN,
} from 'CONSTANTS/routeTokens';
import { RickAndMortyCharacter } from 'ROUTES/shared/composedChunks';
import { rickAndMortyCharacter as middleware } from 'ROUTES/shared/middleware';
import getData from 'UTILS/getData';

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

let handler;
if(process.env.IS_SERVER){
  handler = require('ROUTES/handlers/catchAll').default;
}

export default {
  get: [
    {
      handler,
      path: `${ ITEM_ROUTE }${ ITEM_TOKEN }`,
      view: Item,
      viewProps: {
        ssr: getData,
        title: 'Rick & Morty Character',
      },
    },
  ],
};
