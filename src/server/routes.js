import { statSync } from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { renderStatic } from 'glamor/server';
import appConfig from 'ROOT/conf.app';
import Shell from 'COMPONENTS/Shell';
import findSSRData from 'UTILS/findSSRData';
import AppShell from './views/AppShell';


const isDev = process.env.NODE_ENV === 'development';

// ensures the favicon is always current (with every start of the server)
const faviconModTime = statSync(appConfig.paths.FAVICON).mtimeMs;

module.exports = {
  get: {
    // NOTE - add any other paths above the `*` catch-all route,
    // like static assets, or API's

    // route everything else to the app
    '*': (req, res) => {
      const {
        footerProps,
        headerProps,
        mainProps,
      } = require(`${ appConfig.paths.SRC }/data`);

      findSSRData(req.url, [
        footerProps,
        headerProps,
        mainProps,
      ]).then(() => {
        // The `context` object contains the results of the render.
        // `context.url` will contain the URL to redirect to if a <Redirect> was used.
        const context = {};
        let { html, css, ids } = renderStatic(() =>
          renderToString(
            <StaticRouter
              context={ context }
              location={ req.url }
            >
              <Shell
                headerProps={ headerProps }
                mainProps={ mainProps }
                footerProps={ footerProps }
              />
            </StaticRouter>
          )
        );

        res.send(AppShell({
          body: html,
          css,
          dev: isDev,
          faviconModTime,
          glamor: {
            ids,
          },
          title: 'React SPA',
        }));
      });
    },
  },
};
