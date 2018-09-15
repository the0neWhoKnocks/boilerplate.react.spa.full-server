import NotFound from 'COMPONENTS/views/NotFound';

const ROUTE = {
  path: '*',
  view: NotFound,
};

if( process.env.IS_SERVER ){
  ROUTE.handler = require('ROUTES/handlers/app').default;
}

export default {
  get: [ ROUTE ],
};
