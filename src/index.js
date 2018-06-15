import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Shell from 'COMPONENTS/Shell';
import {
  footerProps,
  headerProps,
  mainProps,
} from './data';

render((
  <BrowserRouter>
    <Shell
      headerProps={ headerProps }
      mainProps={ mainProps }
      footerProps={ footerProps }
    />
  </BrowserRouter>
), document.getElementById('root'));
