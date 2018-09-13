import AsyncChunk from 'COMPONENTS/AsyncChunk';
import { IPSUM_3 } from 'CONSTANTS/routePaths';
import { DefaultView } from 'ROUTES/shared/composedChunks';
import { baconIpsum as middleware } from 'ROUTES/shared/middleware';
import assignRouteHandler from 'UTILS/assignRouteHandler';

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
  get: [
    {
      handler: assignRouteHandler('ROUTES/handlers/app', __dirname),
      label: 'Bacon Ipsum',
      path: IPSUM_3,
      view: ThreePara,
      viewProps: {
        title: 'Bacon Ipsum (3 paragraph, Client-only)',
      },
    },
  ],
};
