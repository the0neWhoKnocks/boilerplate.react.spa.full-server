import AsyncChunk from 'COMPONENTS/AsyncChunk';
import { IPSUM_3 } from 'CONSTANTS/routePaths';
import { DefaultView } from './shared/composedChunks';
import { baconIpsum as middleware } from './shared/middleware';

const reqOpts = {
  url: 'https://baconipsum.com/api/',
  params: {
    paras: 3,
    type: 'all-meat',
  },
  cacheKey: ['url', 'paras', 'type'],
};

const ThreePara = AsyncChunk({
  chunk: DefaultView,
  reqOpts: {
    ...reqOpts,
    middleware: middleware(reqOpts),
  },
});

export default {
  label: 'Bacon Ipsum',
  url: IPSUM_3,
  view: ThreePara,
  viewProps: {
    title: 'Bacon Ipsum (3 paragraph, Client-only)',
  },
};
