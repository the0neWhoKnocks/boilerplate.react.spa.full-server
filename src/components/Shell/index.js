import React from 'react';
import { Provider } from 'react-redux';
import { shape } from 'prop-types';
import defaultHeader from 'COMPONENTS/Header';
import defaultMain from 'COMPONENTS/Main';
import defaultFooter from 'COMPONENTS/Footer';
import {
  createStore,
  extraArgs,
  reducer,
} from 'STATE/store';
import './styles';


let Router;
if( process.env.IS_CLIENT ){
  /**
   * Normally `process.env` is only available in node, but utilizing the
   * DefinePlugin allows us to expose certain variables, and in turn, during
   * the uglification step, nodes that will never be true, will be removed.
   * Basically this block will never be added on the client, but when this
   * component is loaded on the server, it'll load the appropriate router.
   */
  const { BrowserRouter } = require('react-router-dom');
  Router = BrowserRouter;
}
else{
  const { StaticRouter } = require('react-router');
  Router = StaticRouter;
}

const composeShell = (
  Header=defaultHeader,
  Main=defaultMain,
  Footer=defaultFooter
) => {
  const Shell = ({
    context,
    footerProps,
    headerProps,
    mainProps,
    request,
    store,
  }) => {
    const _store = store || createStore(reducer(), ...extraArgs);
    const routerProps = {};

    if(context){
      routerProps.context = context;
      routerProps.location = request.url;
    }

    return (
      <Provider store={ _store }>
        <Router { ...routerProps }>
          <div className="shell">
            <Header { ...headerProps } />
            <Main store={ _store } { ...mainProps } />
            <Footer { ...footerProps } />
          </div>
        </Router>
      </Provider>
    );
  };

  Shell.propTypes = {
    // Object from server which allows for tracking redirects from Router
    context: shape({}),
    // The props for the Footer component
    footerProps: shape({}).isRequired,
    // The props for the Header component
    headerProps: shape({}).isRequired,
    // The props for the Main component
    mainProps: shape({}).isRequired,
    // A request from the server
    request: shape({}),
    // The app's store
    store: shape({}),
  };

  return Shell;
};

export default composeShell();
export {
  composeShell,
};
