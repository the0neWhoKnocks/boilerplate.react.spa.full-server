import { TERMS } from 'CONSTANTS/routePaths';
import { DefaultView } from 'ROUTES/shared/composedChunks';

let handler;
if(process.env.IS_SERVER){
  handler = require('ROUTES/handlers/catchAll').default;
}

export default {
  get: [
    {
      handler,
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
