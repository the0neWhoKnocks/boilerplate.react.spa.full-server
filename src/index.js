import React from 'react';
import { hydrate } from 'react-dom';
import { rehydrate } from 'glamor';
import Shell from 'COMPONENTS/Shell';
import log from 'UTILS/logger';
import {
  footerProps,
  headerProps,
  mainProps,
} from './data';

window.globals = window.WP_GLOBALS;

rehydrate(window._glam);
hydrate((
  <Shell
    footerProps={ footerProps }
    headerProps={ headerProps }
    mainProps={ mainProps }
  />
), document.getElementById('root'));

log('%gb APP', JSON.stringify(window.globals.app, null, 2));
