import AsyncChunk from 'COMPONENTS/AsyncChunk';
import { IPSUM_3 } from 'CONSTANTS/routePaths';
import { DefaultView } from 'ROUTES/shared/composedChunks';
import { baconIpsum as middleware } from 'ROUTES/shared/middleware';

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

const ROUTE = {
  label: 'Bacon Ipsum',
  path: IPSUM_3,
  view: ThreePara,
  viewProps: {
    title: 'Bacon Ipsum (3 paragraph, Client-only)',
  },
};

if( process.env.IS_SERVER ){
  ROUTE.handler = require('ROUTES/handlers/app').default;
}

export default {
  get: [ ROUTE ],
};
