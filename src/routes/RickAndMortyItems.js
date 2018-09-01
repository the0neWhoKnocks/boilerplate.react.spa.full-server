import AsyncChunk from 'COMPONENTS/AsyncChunk';
import { ROOT, ITEM } from 'CONSTANTS/routePaths';
import getData from 'UTILS/getData';
import { RickAndMortyCharacters } from './shared/composedChunks';
import { rickAndMortyCharacters as middleware } from './shared/middleware';

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

export default {
  exact: true,
  label: 'Rick & Morty',
  url: ROOT,
  view: Items,
  viewProps: {
    linkPrefix: ITEM,
    ssr: getData,
    title: 'Rick & Morty',
  },
};
