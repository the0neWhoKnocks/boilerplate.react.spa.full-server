import { TERMS } from 'CONSTANTS/routePaths';
import { DefaultView } from 'ROUTES/shared/composedChunks';
import assignRouteHandler from 'UTILS/assignRouteHandler';

export default {
  get: [
    {
      handler: assignRouteHandler('ROUTES/handlers/app', __dirname),
      label: 'Terms of Service',
      path: TERMS,
      view: DefaultView,
      viewProps: {
        title: 'Terms of Service',
        data: [
          'Just some legal mumbo jumbo',
        ],
      },
    },
  ],
};
