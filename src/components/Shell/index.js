import React from 'react';
import { connect, Provider } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { arrayOf, node, shape, string } from 'prop-types';
import defaultHeader from 'COMPONENTS/Header';
import defaultMain from 'COMPONENTS/Main';
import defaultFooter from 'COMPONENTS/Footer';
import { CLIENT_ROUTES } from 'ROUTES';
import {
  headerNavItems as defaultHeaderNavItems,
  footerNavItems as defaultFooterNavItems,
} from 'SRC/data';
import store from 'STATE/store';
import {
  getLoggingEnabled,
  getShellClass,
} from 'STATE/selectors';
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

const mapStateToProps = (state) => ({
  shellClass: getShellClass(state),
});

const ShellWrap = ({
  children,
  shellClass,
}) => {
  return (
    <div className={`shell ${ shellClass || '' }`}>{children}</div>
  );
};
ShellWrap.propTypes = {
  children: node,
  shellClass: string,
};

const composeShell = (
  Header = defaultHeader,
  Main = defaultMain,
  Footer = defaultFooter
) => {
  const Shell = ({
    context,
    headerNavItems = defaultHeaderNavItems,
    footerNavItems = defaultFooterNavItems,
    request,
  }) => {
    const routerProps = {};

    if(context){
      routerProps.context = context;
      routerProps.location = request.url;
    }

    const ConnectedShell = withRouter(connect(mapStateToProps)(ShellWrap));

    return (
      <Provider store={ store.app }>
        <Router { ...routerProps }>
          <ConnectedShell>
            <Header navItems={ headerNavItems } />
            <Main routes={ CLIENT_ROUTES } />
            <Footer
              loggingEnabled={ getLoggingEnabled(store.app.getState()) }
              navItems={ footerNavItems }
            />
          </ConnectedShell>
        </Router>
      </Provider>
    );
  };

  Shell.propTypes = {
    // Object from server which allows for tracking redirects from Router
    context: shape({}),
    headerNavItems: arrayOf(shape({})),
    footerNavItems: arrayOf(shape({})),
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
  mapStateToProps,
  ShellWrap,
};
