import AsyncChunk from 'COMPONENTS/AsyncChunk';
import {
  ITEM as ITEM_ROUTE,
} from 'CONSTANTS/routePaths';
import {
  ITEM as ITEM_TOKEN,
} from 'CONSTANTS/routeTokens';
import getData from 'UTILS/getData';
import { RickAndMortyCharacter } from './shared/composedChunks';
import { rickAndMortyCharacter as middleware } from './shared/middleware';

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

export default {
  url: `${ ITEM_ROUTE }${ ITEM_TOKEN }`,
  view: Item,
  viewProps: {
    ssr: getData,
    title: 'Rick & Morty Character',
  },
};
