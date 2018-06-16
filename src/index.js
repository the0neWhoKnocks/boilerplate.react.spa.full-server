import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Shell from 'COMPONENTS/Shell';
import {
  footerProps,
  headerProps,
  mainProps,
} from './data';

window.globals = window.WP_GLOBALS;

render((
  <BrowserRouter>
    <Shell
      headerProps={ headerProps }
      mainProps={ mainProps }
      footerProps={ footerProps }
    />
  </BrowserRouter>
), document.getElementById('root'));

console.log(
  '%c APP ',
  'background:#222; color:#bada55; padding:0.25em 0.5em; border-radius:0.5em',
  JSON.stringify(window.globals.app, null, 2)
);
