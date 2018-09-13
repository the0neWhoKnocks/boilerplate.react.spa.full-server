import React from 'react';
import appConfig from 'ROOT/conf.app';
import routeWrapper from 'UTILS/routeWrapper';
import log, {
  BLACK_ON_GREEN,
  BLACK_ON_YELLOW,
  BLUE_START,
  BLUE_END,
} from 'UTILS/logger';

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

  awaitSSRData(req.url, req.params, [
    mainProps,
  ]).then(() => {
    footerProps.loggingEnabled = (req.cookies.logging) ? true : false;

    const Loadable = require('react-loadable');
    const { getBundles } = require('react-loadable/webpack');
    const loadableStats = require('SRC/react-loadable.json');
    let modules = [];
    const captureSSRChunks = (moduleName) => modules.push(moduleName);

    // The `context` object contains the results of the render.
    // `context.url` will contain the URL to redirect to if a <Redirect> was used.
    const context = {};
    let { html, css, ids } = renderStatic(() =>
      renderToString(
        <Loadable.Capture report={captureSSRChunks}>
          <ClientShell
            context={ context }
            footerProps={ footerProps }
            headerProps={ headerProps }
            mainProps={ mainProps }
            request={ req }
          />
        </Loadable.Capture>
      )
    );
    let ssrChunks = getBundles(loadableStats, modules);

    if( context.url ){
      res.redirect(302, context.url);
    }
    else{
      if(ssrChunks.length){
        const chunkNames = ssrChunks
          .filter((chunk) => !chunk.file.endsWith('.map'))
          .map((chunk) => `\n  - ${ BLUE_START } ${ chunk.file } ${ BLUE_END }`);
        log(`${ BLACK_ON_GREEN } CHUNKS`, 'Will be pre-loaded on the Client:', chunkNames.join(''));
      }
      else{
        log(`${ BLACK_ON_YELLOW } WARNING`, 'No SSR chunks were detected, this may be an error');
      }

      res.send(AppShell({
        body: html,
        css,
        dev: isDev,
        faviconModTime,
        glamor: { ids },
        ssrChunks,
        state: serialize(store.app.getState()),
        title: appConfig.APP_TITLE,
      }));
    }
  });
});
