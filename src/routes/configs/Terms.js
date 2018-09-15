import { TERMS } from 'CONSTANTS/routePaths';
import { DefaultView } from 'ROUTES/shared/composedChunks';

const ROUTE = {
  label: 'Terms of Service',
  path: TERMS,
  view: DefaultView,
  viewProps: {
    title: 'Terms of Service',
    data: [
      'Just some legal mumbo jumbo',
    ],
  },
};

if( process.env.IS_SERVER ){
  ROUTE.handler = require('ROUTES/handlers/app').default;
}

export default {
  get: [ ROUTE ],
};
