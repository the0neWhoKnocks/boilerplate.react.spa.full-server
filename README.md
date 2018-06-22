# React SPA (Full Server)

A boilerplate for creating a SPA in React, with a full server.

![flow_v2](https://user-images.githubusercontent.com/344140/41495959-9a7010d8-70e8-11e8-9f88-87d7c7bc5410.gif)

- Uses `express` to serve bundled app.
- Utilizes `glamor` for styling
- Favicon updates on bundle creation
- Uses `cross-env` & `cross-conf-env` for multi-platform support.
- Demonstrates:
  - How to expose file-system data via the Webpack `DefinePlugin`.
  - How to set up Webpack aliasing so that imports are clean and don't contain
    any `../../../../../` craziness. Also useful during refactors when folders
    get moved around, you just have to update the paths in `conf.app.js` and
    you're all set.

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

## How Does It All Work?

Files of note:
```sh
/dist # (only appears after a build) The folder to be deployed to production
  ├─ /private # CommonJS compiled server code (nothing in here should be exposed to users)
  └─ /private # ES Webpack bundles (exposed to the users)
/src
  ├─ /components # Where all the React components live
  │  ├── Main
  │  └── ViewHOC
  ├─ /server # All server specific code
  │  ├─ /routes # All the Express routes
  │  │  └─ catchAll.js # The function that handles everything right now
  │  │  └─ index.js # Combines all routes for server consumption
  │  ├─ /views
  │  │  └─ AppShell.js
  │  └── index.js # The server
  ├─ /state # Home of everything state related
  ├─ /static # Static assets that won't be compiled, but just copied over to dist
  ├─ /utils # Utilities that do one thing only
  ├─ data.js # Where the app gets (and sometimes sets) it's data
  └─ index.js # The entry point for WP - sets up the Shell & hydrates styles and state
```

- Currently there's a catch-all route in `routes.js` that then renders the
  `AppShell` which controls the document HTML, CSS, and JS.
- Each `View` that's defined in `data.js` is responsible for loading it's own
  `data`. It does that by providing a static value, or via a function that
  returns a Promise.
- `ViewHOC` will display a spinner if it's data isn't found in cache, otherwise
  it'll pass the data on to the `View` it was provided.
- The `Main` component handles the SPA routing. So if you need to add
  routes that aren't defined in `navItems` for `header` or `footer`
  (within `data.js`), you need to add them to `otherRoutes` (within `data.js`).

---

## API's used

- https://baconipsum.com/json-api/
- https://rickandmortyapi.com/documentation/
