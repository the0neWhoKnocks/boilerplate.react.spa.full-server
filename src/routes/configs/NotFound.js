import NotFound from 'COMPONENTS/views/NotFound';
import assignRouteHandler from 'UTILS/assignRouteHandler';

export default {
  get: [
    {
      handler: assignRouteHandler('ROUTES/handlers/app', __dirname),
      path: '*',
      view: NotFound,
    },
  ],
};
