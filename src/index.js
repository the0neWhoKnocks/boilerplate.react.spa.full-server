import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from 'COMPONENTS/App';
import './styles';

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
