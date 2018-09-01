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
- [Gotchas](#gotchas)

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
- How to integrate Webpack's aliasing during transpilation.

### Express

- How to set up logging for routes, so you're aware of what routes are actually
  processing the page.
- How to use `nodemon` and `reload` while in dev to get automatic server and
  page reloads when files change.

### General JS Stuff

- How to set up a `logger` that can log the same colored output on the server
  as it does the client.

### Jest
- How to reuse Webpack aliasing for easier file resolution.

### React

- How to set up SSR and client data/style hydration.
- How to set up infinite scrolling of items using [react-waypoint](https://github.com/brigade/react-waypoint)
  and Redux.
- How to set up custom view transitions without the use of `react-transition-group`
  (since it doesn't support that out of the box). By that I mean you can have
  default view transitions for most pages, or custom transitions based on the
  route you're coming `from` and `to`, or visa versa.
- How to set up a per-view theming mechanism.
- How to set up and utilize `breakpoints` with components and their styles.
- How to set up async data loading so components render on the server or show
  a spinner on the client.

### Webpack

- How to use the `DefinePlugin` to:
  - Expose (non-sensitive) file-system data on the client with `window.WP_GLOBALS`.
  - Set up requires/imports so that server specific code is stripped out during
    compilation so you don't get errors on the client, and smaller bundles. All
    from the use of `process.env.IS_CLIENT`.
- How to set up aliasing so that imports are clean and don't contain any
  `../../../../../` craziness. Also useful during refactors when folders
  get moved around, you just have to update the paths in `conf.app.js` and
  you're all set.
- How to set up bundle filename hashing correctly so that they only change
  when the file contents have changed (allowing the user to keep old bundles
  in cache).

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
- ‎Everything under `src` will be compiled in some way. Parts of `src` will be
  bundled and dumped in `dist/public` and everything will be transpiled to
  `dist/private` so that the server code can 1 - be debugged easily (not being
  bundled) and 2 - make use of imports (so no mental hoops of "should I use
  require or import").
- ‎Not using `webpack-dev-middleware` because it obfuscates where the final
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

---

## Gotchas

**Testing**
- `genMockFromModule` doesn't work with `moduleNameMapper` (Webpack aliases), so
  for now you have to manually mock aliased deps. For example, this pattern works
  ```js
  jest.mock('ALIAS/file', () => ({ key:'val' }))
  ```
