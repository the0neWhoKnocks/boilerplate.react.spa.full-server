import appConfig from 'ROOT/conf.app';
const assetList = require(`${ appConfig.paths.DIST_PUBLIC }/${ appConfig.webpack.MANIFEST_NAME }`);

// builds out the list of bundle scripts in the order specified in the config
const bundleScripts = Object.keys(appConfig.webpack.entries).map((key) => {
  return `<script type="text/javascript" src="${ assetList[`${ appConfig.webpack.entries[key] }.js`] }"></script>`;
});

module.exports = function(model){
  const stateScript = model.state && `<script>window.__PRELOADED_STATE__ = ${ model.state };</script>`;
  const glamorScript = model.glamor && `<script>window._glam = ${ JSON.stringify(model.glamor.ids) };</script>`;
  // allows for hot-reloading
  const reloadScript = model.dev && '<script type="text/javascript" src="/reload/reload.js"></script>' || '';

  return `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <title>${ model.title }</title>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">

        <link rel="manifest" href="/manifest.json">
        <link rel="shortcut icon" href="/media/favicon.png?v=${ model.faviconModTime }">

        <style>${ model.css }</style>

        ${ glamorScript }
        ${ stateScript }
      </head>
      <body>
        <div id="root" class="root">${ model.body }</div>
        ${ bundleScripts.join('') }
        ${ reloadScript }
      </body>
    </html>
  `;
};
