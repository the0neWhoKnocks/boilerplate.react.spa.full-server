import React from 'react';
import { hydrate } from 'react-dom';
import { rehydrate } from 'glamor';
import Shell from 'COMPONENTS/Shell';
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

console.log(
  '%c APP ',
  'background:#222; color:#bada55; padding:0.25em 0.5em; border-radius:0.5em',
  JSON.stringify(window.globals.app, null, 2)
);
