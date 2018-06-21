import React from 'react';
import appConfig from 'ROOT/conf.app';

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  get: {
    // NOTE - add any other paths above the `*` catch-all route,
    // like static assets, or API's

    // route everything else to the app
    '*': (req, res) => {
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
      const store = require('STATE/store').default;
      const AppShell = require('./views/AppShell');

      // ensures the favicon is always current (with every start of the server)
      const faviconModTime = statSync(appConfig.paths.FAVICON).mtimeMs;

      awaitSSRData(req.url, [
        footerProps,
        headerProps,
        mainProps,
      ]).then(() => {
        // The `context` object contains the results of the render.
        // `context.url` will contain the URL to redirect to if a <Redirect> was used.
        const context = {};
        let { html, css, ids } = renderStatic(() =>
          renderToString(
            <ClientShell
              context={ context }
              footerProps={ footerProps }
              headerProps={ headerProps }
              mainProps={ mainProps }
              request={ req }
            />
          )
        );

        if( context.url ){
          res.redirect(302, context.url);
        }
        else{
          res.send(AppShell({
            body: html,
            css,
            dev: isDev,
            faviconModTime,
            glamor: { ids },
            state: serialize(store.getState()),
            title: 'React SPA',
          }));
        }
      });
    },
  },
};
