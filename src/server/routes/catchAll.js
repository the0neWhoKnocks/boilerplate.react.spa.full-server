import React from 'react';
import appConfig from 'ROOT/conf.app';
import routeWrapper from 'UTILS/routeWrapper';

const isDev = process.env.NODE_ENV === 'development';

export default routeWrapper.bind(null, (req, res) => {
  // if a relative file request makes it here, it's most likely an error
  if( /.*\.(js|css|json|jpg|png|gif)$/.test(req.url) ){
    res.status(404);
    res.send('File not found in catch-all route');
  }

  // route specific modules
  const { statSync } = require('fs');
  const { renderToString } = require('react-dom/server');
  const { renderStatic } = require('glamor/server');
  const serialize = require('serialize-javascript');
  const ClientShell = require('COMPONENTS/Shell').default;
  const awaitSSRData = require('UTILS/awaitSSRData').default;
  const {
    footerProps,
    headerProps,
    mainProps,
  } = require('SRC/data');
  const { default: store } = require('STATE/store');
  const AppShell = require('SERVER/views/AppShell');
  const { setShellClass } = require('STATE/actions');

  store.app.dispatch( setShellClass({ pathname: req.path }) );

  // ensures the favicon is always current (with every start of the server)
  const faviconModTime = statSync(appConfig.paths.FAVICON).mtimeMs;

  awaitSSRData(store.app, req.url, req.params, [
    mainProps,
  ]).then(() => {
    footerProps.loggingEnabled = (req.cookies.logging) ? true : false;

    const { getLoadableState } = require('loadable-components/server');

    // The `context` object contains the results of the render.
    // `context.url` will contain the URL to redirect to if a <Redirect> was used.
    const context = {};
    const shell = (
      <ClientShell
        context={ context }
        footerProps={ footerProps }
        headerProps={ headerProps }
        mainProps={ mainProps }
        request={ req }
      />
    );

    // Extract loadable state from application tree
    getLoadableState(shell).then(loadableState => {
      let { html, css, ids } = renderStatic(() =>
        renderToString(shell)
      );

      if( context.url ){
        res.redirect(302, context.url);
      }
      else{
        res.send(AppShell({
          body: html,
          chunkScript: loadableState.getScriptTag(),
          css,
          dev: isDev,
          faviconModTime,
          glamor: { ids },
          state: serialize(store.app.getState()),
          title: appConfig.APP_TITLE,
        }));
      }
    });
  });
});
