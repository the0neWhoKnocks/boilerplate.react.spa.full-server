# React SPA (Full Server)

A boilerplate for creating a SPA in React, with a full server.

![spa-and-server-02](https://user-images.githubusercontent.com/344140/41952478-ec21c832-7984-11e8-904e-8213d4adf8fa.gif)

**Index**
- [Features](#features)
- [Starting the Dev Server](#start-up-dev-server)
- [Building a Production Package](#build-and-start-up-the-production-package)
- [What This Repo Demonstrates](#demonstrates)
  - [Babel](#babel)
  - [Express](#express)
  - [General JS Stuff](#general-js-stuff)
  - [Jest](#jest)
  - [React](#react)
  - [Webpack](#webpack)
- [How Things Work](#how-does-it-all-work)
- [API's Used](#apis-used)

---

## Features

- Uses `express` to serve bundled assets.
- Utilizes `glamor` for styling.
- Favicon updates on bundle creation to ensure a stale favicon doesn't get stuck
  in the user's cache.
- Uses `cross-env` & `cross-conf-env` for multi-platform support.
- Uses `concurrently` to run multiple processes needed to start the server in
  dev mode, and allows for custom labels for each process to make parsing the
  output for the dev easier.
- Uses `react-loadable` for dynamic `import`s of chunked files.
- SSR (Server-Side Rendering) of components and Client hydration.
- After all's said and done, the whole production app compiles down to a lean
  `~100kb` (gzipped).

![spa-and-server--cli-01](https://user-images.githubusercontent.com/344140/41952490-f8c2cfd2-7984-11e8-81e2-39c579a08a89.gif)

---

## Start up dev server

```sh
yarn start:server:dev
```

When the server starts in `dev` mode you can debug server code by visiting
`chrome://inspect` (if you're using Chrome as your browser). Then go to the
`Sources` tab and find the file you want to debug.

---

## Build and start up the production package

```sh
# builds the deployment package & starts a simple server to verify built code
yarn start:server
```

---

## Demonstrates:

### Babel

- How to compile ES6 code that's utilizing Webpack aliasing and imports, down to
  CommonJS that the server can utilize. Just compiling over to CommonJS, and not
  a bundle, is useful for debugging and inline manipulation.
  1. I utilize the `env` option which allows me to [set up profiles][babel-env-link]
     for `development`, `production`, `server`, and `test`.
  1. Then when you run Babel, you just [specify the env][babel-specify-env] you
     want Babel to run under. Notice the use of `BABEL_ENV=\"production\"`. The
     backslashes are for consistent usage on Nix and Windows systems.
- How to integrate Webpack's aliasing during transpilation.
  1. The top-level [config has a `webpack` section with an `aliases`][conf-wp-aliases]
     list. I do this to allow for more control of what's considered an alias.
  1. Then I just use the `webpack-alias` Babel plugin to [use the aliases wired up
     in my Webpack config][babel-wp-aliases].     
- How to use a custom internal Babel plugin.
  1. When integrating `react-loadable` I needed to edit it's Babel plugin to
     allow for usage with a composable function. So I duplicated it to the
     `appendChunkProps.js` plugin, and made my changes.
  1. Then you just [configure and use it like any other plugin][babel-custom-plugin],
     the only difference being the relative pathing, and ensuring that the pointer
     ends with `.js`.
- How to define varaiables like the Webpack `DefinePlugin` does, for consistent
  variable usage.
  1. Just had to [use the `transform-define` plugin][babel-define-vars].

### Express

- How to set up logging for routes, so you're aware of what routes are actually
  processing the page.
  1. Created a [`routesWrapper` util][file-routeWrapper], then I [wrap my
     routes with that util][routeWrapper-usage] during export.
- How to ensure a view has it's data loaded before it's rendered on the server.
  1. When setting up the config for the route I [specify a `ssr` prop][ssr-prop-usage]
     with a function that loads data.
  1. Then the [route utilizes the `awaitSSRData` util][awaitSSRData-usage]
     to load that views data before it gets rendered.
- How to use `nodemon` and `reload` while in dev to get automatic server and
  page reloads when files change.
  1. Like with Babel's config, I generate the `nodemon.json` from a JS file,
     so that I can utilize the paths defined in the global config. The I
     just [use `nodemon` like usual][nodemon-usage].
  1. For `reload` you just need to [wire it up in the server][reload-exp-usage]
     (for the websocket), and then [include a request for it's "script"][reload-client-usage]
     on the Client. I say "script" because there's no actual file, the request
     is caught on the server and `reload` responds back with data.

### General JS Stuff

- How to set up a `logger` that can log the same colored output on the server
  as it does the client.
  1. The [`logger` util][file-logger] utilizes a `clientTransform` and
     `serverTransform` to allow for a consistent API usage, but allow for 
     the custom coloring syntax required for terminals, or the Client's Dev-Tools.
  1. Admittedly the API's a bit kludgy, but it's what works atm. For any
     text that you want colorized, you [use the constants exported from
     the logger][logger-usage].

### Jest
- How to reuse Webpack aliasing for easier file resolution.
  1. Jest uses a config prop called `moduleNameMapper` which can be used
     to tell Jest how to resolve paths. So I just [loop over the config
     aliases to generate the RegEx's][jest-wp-aliases] for the mapper.
     - **NOTE** - `genMockFromModule` doesn't work with `moduleNameMapper`
       so for now you have to manually mock aliased deps. For example, this
       pattern works:
       ```js
       jest.mock('ALIAS/file', () => ({ key:'val' }))
       ```

### React

- How to set up SSR and client data/style hydration.
  1. For the server, you have to [`renderStatic` (for `glamor`) and
     `renderToString` (for `react-dom`)][ssr-hydration-1]. The results of 
     those calls return to you the `css`, `html`, and `ids`. We only care about
     `ids` for CSS hydration.
  1. We then [pass `ids` and the current Redux store state][ssr-hydration-2]
     to the template that renders the page.
  1. The template then [dumps that data into script tags][ssr-hydration-3] that
     the Client can read from.
  1. The Client entry then [reads that server data][client-hydration-1], and
     determines whether or not anything needs to be changed (which there
     shouldn't be), and sets up any listeners/handlers.
- How to set up infinite scrolling of items using [react-waypoint](https://github.com/brigade/react-waypoint)
  and Redux.
  1. You [set up a waypoint in your component][waypoint-1] so that when the
     user scrolls to within a certain threshold of that waypoint, it [triggers
     a handler][waypoint-2] to load more items.
  1. Once that Redux action has loaded more items and updated the store, the
     `results` count increases, causing another render, and so long as there's
     a `nextPage` present, another waypoint is set, and the cycle continues
     until the user reaches the end.
- How to set up custom view transitions without the use of `react-transition-group`
  (since it doesn't support that out of the box). By that I mean you can have
  default view transitions for most pages, or custom transitions based on the
  route you're coming `from` and `to`, or visa versa.
  1. Created the `ViewTransition` component that can tap into the `react-router`
     data to [allow for a user-defined `middleware`][viewtransition-1] to 
     temporarily display the current component and next component, and
     transition between the two. It has default transition styles set for
     `from` and `to`, but [they can be overridden in the passed in `middleware`][viewtransition-2].
     You can see that the middleware is checking what path it's coming `from`
     and going `to`, and based on that, returning different transition styling.
- How to set up a per-view theming mechanism.
  1. Based on the currently matched route, the [server][shell-theme-1] and the
     [client][shell-theme-2] call the [`setShellClass` action][shell-theme-3]
     which will in turn set a CSS class on the shell allowing for custom theming.
- How to set up and utilize top-level `breakpoints` for use with all components.
  1. The [`breakpoints` file][file-breakpoints] has only a few definitions,
     `mobile` being the most used.
  1. Then in a component's `styles` file, you [use it like so][breakpoints-usage].
- How to set up async data loading so components render on the server or show
  a spinner on the client.
  1. There's a lot going on to achieve this, but if I had to boil it down:
     - The data is fetched on the server via the `getData` util.
     - The data is added into the store under `viewData`.
     - Only then is the view rendered on the server.
     - Once the Client loads, it hydrates the view.
     - If a user switches a view, the [`componentDidMount` lifecycle is called
       within the `AsyncChunk` HOC][isomorphic-data], which then triggers a call
       to `getData` which will check if the request has already been made - if
       it has, will return the already fetched data - if not, will fetch the new
       data, which then will update the `viewData` causing state change from
       loading to not.
- How to set up an image loader so image loads don't block the initial load of
  the page.
  1. The result in `results` come with an image URL. When looping over those
     results [I check if a `_loaded` prop's been set][async-img-load] - if it has,
     I just render a normal `img` tag - if not, I use the `ImageLoader` component
     which will still render an `img` tag, but with a base64 1x1 pixel (so all `img`
     styling still behaves the same) for the `src`, and a `data-src` attribute with
     the actual image source. On the Client, once the load of the image has begun,
     a load indicator will display, and on load complete the image will fade in
     for a smooth transition instead of it just popping into view. Once the image
     has loaded, it'll trigger the `onLoad` callback (if one was passed), which
     [in this case][async-img-load-2] will change the current result's state to
     `_loaded: true`.
  1. If it's determined that you'd prefer to have the image sources maintained
     during SSR, you could just set the `_loaded` state of the current results
     to `true`.
- How to use `react-loadable` along with Webpack chunks to load chunks of code
  only when necessary.
  1. [Wire up Webpack][react-loadable] to capture Loadable component during chunk creation.
     - [Ensure Webpack names chunks correctly][react-loadable-a].
  1. Each `Loadable` is built out [via `composedChunks`][file-composedChunks].
     The `composeChunk` util sets up `Loadable` with the same defaults and allows
     for less dev set-up.
  1. Those composed chunks are then [passed to the `AsyncChunk` HOC][dynamic-import]
     which allows for a consistent loading state (like when waiting for data, or
     the component to load), and allows for smooth transition from loading state
     to the loaded component, error, or timeout views.
  1. To ensure that chunks are rendered on the server properly you have to [preload
     all the chunks][react-loadable-1] before the server starts up.
  1. You then have to [capture all the chunks][react-loadable-2] that were rendered
     for the current page on the server, so they can be [pre-loaded before Client
     hydration][react-loadable-3].
  1. Then on the Client, it [ensures that pre-loaded chunks have loaded][react-loadable-4]
     before the hydration occurs.
- How to load a chunk on-demand (Client only)
  1. You don't need React for this, but a majority of the integration would in a
     component.
  1. [In this case][dynamic-import-2] I'm keying off of a cookie that's set via
     a toggle on the Client. If the cookie is set, it will return the
     `clientTransform` for logging, otherwise it'll just use a noop and no
     logging will occur.

### Webpack

- How to use the `DefinePlugin` to:
  1. Expose (non-sensitive) file-system data on the client [with `window.WP_GLOBALS`][wp-define-1].
  1. [Set up requires/imports so that server specific code is stripped out][wp-define-2]
     during compilation so you don't get errors on the client, and smaller bundles.
     All from the use of `process.env.IS_CLIENT`.
- How to set up aliasing so that imports are clean and don't contain any
  `../../../../../` craziness. Also useful during refactors when folders
  get moved around, you just have to update the paths in `conf.app.js` and
  you're all set.
  1. [Wire up the aliases][wp-aliases-1] from the global config.
  1. [Prefix your imports or requires][wp-aliases-2] with exposed aliases.
- How to [set up bundle filename hashing][wp-hash-name] correctly so that they
  only change when the file contents have changed (allowing the user to keep
  old bundles in cache).

---

## How Does It All Work?

Files of note:
```sh
.
├── /dist
│   ├── /private # ES Webpack bundles (exposed to the users)
│   └── /public # CommonJS compiled server code (nothing in here should be exposed to users)
│
├── /src
│   ├── /components # Where all the React components live
│   │   ├── /AsyncChunk # Ensures data is loaded before the view is rendered
│   │   ├── /AsyncLoader # Displays the spinner and maintains scroll position
│   │   ├── /Main # Where all the React routes are set up
│   │   ├── /Shell # Uses a BrowserRouter or StaticRouter based on the env it's running on
│   │   ├── /views # Where all the views live (think of them like pages)
│   │   └── /ViewTransition # Handles transitioning between pages
│   │
│   │   # Configurations for each route path. They define what's picked up by
│   │   # react-router & Express, and what view to serve up if the path is matched.
│   ├── /routes
│   │   ├── /shared
│   │   │   ├── composedChunks.js # Where `Loadable` chunks are composed for dynamic imports.
│   │   │   └── middleware.js # If a component is dependent on loaded data, these functions update the store with that data.
│   │   │
│   │   └── ... # Route config files
│   │
│   ├── /state # Redux stuff
│   │   ├── ...
│   │   └── store.js # A singleton that allows for using/accessing the store anywhere without having to use Connect.
│   │
│   │
│   ├── /server # All server specific code
│   │   ├── /routes # Separate files for each route handler
│   │   │   ├── catchAll.js # The default route handler
│   │   │   └── index.js # Where you combine all your routes into something the server loads
│   │   │
│   │   ├── /views # Should only be one view, but you can house any others here
│   │   │   └── AppShell.js # The template that scafolds the html, body, scripts, & css
│   │   │
│   │   └── index.js # The heart of the beast
│   │
│   ├── /state # Where the app state lives
│   ├── /static # Static assets that'll just be copied over to public
│   ├── /utils # Individual utility files that export one function and do only one thing well
│   ├── data.js # Where the app gets it's data from (aside from API calls)
│   └── index.js # The Webpack entry point for the app
│
└── conf.app.js # The configuration for the app
```

- Currently there's a `catchAll.js` route in `routes` that then renders the
  `AppShell` which controls the document HTML, CSS, and JS.
- Each `View` that's defined in `data.js` is responsible for loading it's own
  `data`. It does that by providing a static value, or via a function that
  returns a Promise.
- `AsyncChunk` will display a spinner if it's data isn't found in cache, otherwise
  it'll pass the data on to the `View` it was provided.
- The `Main` component handles the SPA routing. So if you need to add
  routes that aren't defined in `navItems` for `header` or `footer`
  (within `data.js`), you need to add them to `otherRoutes` (within `data.js`).
- Everything under `src` will be compiled in some way. Parts of `src` will be
  bundled and dumped in `dist/public` and everything will be transpiled to
  `dist/private` so that the server code can 1 - be debugged easily (not being
  bundled) and 2 - make use of imports (so no mental hoops of "should I use
  require or import").
- Not using `webpack-dev-middleware` because it obfuscates where the final
  output will be until a production bundle is created, and you have to add extra
  Webpack specific code to your server. With the use of the `TidyPlugin`,
  `reload`, and `webpack-assets-manifest` in conjunction with the `watch`
  option - we get a live-reload representation of what the production server
  will run.

Notes about the `dev` server:
- Sometimes running `rs` while the server is in dev mode, will exit with `Cannot
  read property 'write' of null`. This will leave a bunch of zombie node
  processes, just run `pkill node` to clean those up.
- Sometimes after killing the server, you'll see a bunch of `node` processes
  still hanging around in Activity Monitor or Task Manager, but if you wait a
  couple seconds they clean themselves up.

---

## API's used

- https://baconipsum.com/json-api/
- https://rickandmortyapi.com/documentation/


[async-img-load]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/views/Items/index.js#L85-L100
[async-img-load-2]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/views/Items/index.js#L55-L57
[awaitSSRData-usage]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/routes/catchAll.js#L41-L43
[babel-env-link]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.babel/conf.babel.js#L36
[babel-specify-env]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/package.json#L10
[babel-wp-aliases]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.babel/conf.babel.js#L45-L47
[babel-custom-plugin]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.babel/conf.babel.js#L11-L24
[babel-define-vars]:https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.babel/conf.babel.js#L48-L51
[breakpoints-usage]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/Header/styles.js#L35-L49
[client-hydration-1]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/index.js#L23-L24
[conf-wp-aliases]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/conf.app.js#L45
[dynamic-import]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/routes/BaconIpsumSingle.js#L16-L22
[dynamic-import-2]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/utils/logger/index.js#L10-L12
[file-composedChunks]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/master/src/routes/shared/composedChunks.js
[file-breakpoints]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/master/src/breakpoints.js
[file-logger]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/master/src/utils/logger/index.js
[file-routeWrapper]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/master/src/utils/routeWrapper.js
[isomorphic-data]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/AsyncChunk/index.js#L95-L118
[jest-wp-aliases]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.jest/conf.jest.js#L53-L56
[logger-usage]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/index.js#L79-L83
[nodemon-usage]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/package.json#L17
[reload-exp-usage]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/index.js#L42-L45
[reload-client-usage]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/views/AppShell.js#L8
[routeWrapper-usage]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/routes/catchAll.js#L13
[shell-theme-1]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/routes/catchAll.js#L36
[shell-theme-2]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/Main/index.js#L49
[shell-theme-3]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/state/actions.js#L51-L64
[ssr-prop-usage]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/routes/BaconIpsumSingle.js#L29
[ssr-hydration-1]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/routes/catchAll.js#L55-L56
[ssr-hydration-2]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/routes/catchAll.js#L89-L91
[ssr-hydration-3]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/views/AppShell.js#L5-L6
[react-loadable]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.webpack/conf.base.js#L109-L116
[react-loadable-a]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.webpack/conf.base.js#L92-L102
[react-loadable-1]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/index.js#L102-L115
[react-loadable-2]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/routes/catchAll.js#L57-L68
[react-loadable-3]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/server/views/AppShell.js#L13-L23
[react-loadable-4]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/index.js#L22
[viewtransition-1]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/Main/index.js#L61-L67
[viewtransition-2]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/Main/index.js#L29-L45
[waypoint-1]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/views/Items/index.js#L104-L114
[waypoint-2]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/views/Items/index.js#L59-L61
[wp-aliases-1]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.webpack/conf.webpack.js#L69-L73
[wp-aliases-2]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/Main/index.js#L6-L13
[wp-define-1]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.webpack/conf.base.js#L134-L151
[wp-define-2]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/src/components/Shell/index.js#L16-L30
[wp-hash-name]: https://github.com/the0neWhoKnocks/boilerplate.react.spa.full-server/blob/d6a0aec320e80d624c407d71b2054fea9f2c7929/.webpack/vars.js#L5
