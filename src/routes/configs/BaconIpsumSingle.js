import AsyncChunk from 'COMPONENTS/AsyncChunk';
import { IPSUM_1 } from 'CONSTANTS/routePaths';
import getData from 'UTILS/getData';
import { DefaultView } from './shared/composedChunks';
import { baconIpsum as middleware } from './shared/middleware';

const oneParaOpts = {
  url: 'https://baconipsum.com/api/',
  params: {
    paras: 1,
    type: 'all-meat',
  },
  cacheKey: ['url', 'paras', 'type'],
};

const OnePara = AsyncChunk({
  chunk: DefaultView,
  reqOpts: {
    ...oneParaOpts,
    middleware: middleware(oneParaOpts),
  },
});

export default {
  label: 'Bacon Ipsum (SSR)',
  url: IPSUM_1,
  view: OnePara,
  viewProps: {
    ssr: getData,
    title: 'Bacon Ipsum (1 paragraph, SSR)',
  },
};
