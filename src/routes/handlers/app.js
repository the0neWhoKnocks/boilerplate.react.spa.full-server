import routeWrapper from 'UTILS/routeWrapper';

export default routeWrapper.bind(null, (req, res) => {
  const { statSync } = require('fs');
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const Loadable = require('react-loadable');
  const { getBundles } = require('react-loadable/webpack');
  const { renderStatic } = require('glamor/server');
  const serialize = require('serialize-javascript');
  const ClientShell = require('COMPONENTS/Shell').default;
  const { LOGGING } = require('CONSTANTS/cookies');
  const appConfig = require('ROOT/conf.app');
  const { CLIENT_ROUTES } = require('ROUTES');
  const AppShell = require('SERVER/views/AppShell');
  const loadableStats = require('SRC/react-loadable.json');
  const {
    setLoggingEnabled,
    setShellClass,
  } = require('STATE/actions');
  const { default: store } = require('STATE/store');
  const {
    default: log,
    BLACK_ON_GREEN,
    BLACK_ON_YELLOW,
    BLUE_START,
    BLUE_END,
  } = require('UTILS/logger');
  const awaitSSRData = require('UTILS/awaitSSRData').default;
  
  const isDev = process.env.NODE_ENV === 'development';
  
  // if a relative file request makes it here, it's most likely an error
  if( /.*\.(js|css|json|jpg|png|gif)$/.test(req.url) ){
    res.status(404);
    res.send('File not found in catch-all route');
  }

  // ensures the favicon is always current (with every start of the server)
  const faviconModTime = statSync(appConfig.paths.FAVICON).mtimeMs;
  
  awaitSSRData(
    req.url,
    req.params,
    CLIENT_ROUTES,
  ).then(() => {
    store.app.dispatch( setLoggingEnabled(!!req.cookies[LOGGING]) );
    store.app.dispatch( setShellClass({ pathname: req.path }) );
    
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
