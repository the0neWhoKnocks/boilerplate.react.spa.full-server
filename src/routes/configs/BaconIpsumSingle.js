import AsyncChunk from 'COMPONENTS/AsyncChunk';
import { IPSUM_1 } from 'CONSTANTS/routePaths';
import { DefaultView } from 'ROUTES/shared/composedChunks';
import { baconIpsum as middleware } from 'ROUTES/shared/middleware';

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

const ROUTE = {
  label: 'Bacon Ipsum (SSR)',
  path: IPSUM_1,
  view: OnePara,
  viewProps: {
    title: 'Bacon Ipsum (1 paragraph, SSR)',
  },
};

if( process.env.IS_SERVER ){
  ROUTE.handler = require('ROUTES/handlers/app').default;
  ROUTE.viewProps.ssr = require('UTILS/getData').default;
}

export default {
  get: [ ROUTE ],
};
