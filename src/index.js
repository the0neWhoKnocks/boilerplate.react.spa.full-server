import React from 'react';
import { hydrate } from 'react-dom';
import Loadable from 'react-loadable';
import { rehydrate } from 'glamor';
import Shell from 'COMPONENTS/Shell';
import log, {
  BLUE,
  GREEN_ON_BLACK,
} from 'UTILS/logger';
import { initStore } from 'STATE/store';

window.globals = window.WP_GLOBALS;
initStore();

Loadable.preloadReady().then(() => {
  rehydrate(window._glam);
  hydrate(<Shell />, document.getElementById('root'));

  log(`${ GREEN_ON_BLACK } APP`, 'data under', `${ BLUE } globals.app`);
  log(JSON.stringify(window.globals.app, null, 2));
});
