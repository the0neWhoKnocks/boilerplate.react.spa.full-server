import React from 'react';
import { hydrate } from 'react-dom';
import { rehydrate } from 'glamor';
import { getCookie } from 'UTILS/cookie';
import Shell from 'COMPONENTS/Shell';
import log, {
  BLUE,
  GREEN_ON_BLACK,
} from 'UTILS/logger';
import { initStore } from 'STATE/store';
import {
  footerProps,
  headerProps,
  mainProps,
} from './data';

window.globals = window.WP_GLOBALS;

if(getCookie('logging')) footerProps.loggingEnabled = true;
initStore();

rehydrate(window._glam);
hydrate((
  <Shell
    footerProps={ footerProps }
    headerProps={ headerProps }
    mainProps={ mainProps }
  />
), document.getElementById('root'));

log(`${ GREEN_ON_BLACK } APP`, 'data under', `${ BLUE } globals.app`);
log(JSON.stringify(window.globals.app, null, 2));
