import AsyncChunk from 'COMPONENTS/AsyncChunk';
import { IPSUM_1 } from 'CONSTANTS/routePaths';
import { DefaultView } from 'ROUTES/shared/composedChunks';
import { baconIpsum as middleware } from 'ROUTES/shared/middleware';
import getData from 'UTILS/getData';

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

let handler;
if(process.env.IS_SERVER){
  handler = require('ROUTES/handlers/catchAll').default;
}

export default {
  get: [
    {
      handler,
      label: 'Bacon Ipsum (SSR)',
      path: IPSUM_1,
      view: OnePara,
      viewProps: {
        ssr: getData,
        title: 'Bacon Ipsum (1 paragraph, SSR)',
      },
    },
  ],
};
