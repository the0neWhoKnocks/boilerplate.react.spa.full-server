import AsyncChunk from 'COMPONENTS/AsyncChunk';
import { ROOT, ITEM } from 'CONSTANTS/routePaths';
import { RickAndMortyCharacters } from 'ROUTES/shared/composedChunks';
import { rickAndMortyCharacters as middleware } from 'ROUTES/shared/middleware';
import assignRouteHandler from 'UTILS/assignRouteHandler';
import getData from 'UTILS/getData';

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
  get: [
    {
      exact: true,
      handler: assignRouteHandler('ROUTES/handlers/catchAll', __dirname),
      label: 'Rick & Morty',
      path: ROOT,
      view: Items,
      viewProps: {
        linkPrefix: ITEM,
        ssr: getData,
        title: 'Rick & Morty',
      },
    },
  ],
};
