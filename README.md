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

Start up dev server

```sh
yarn start:dev
```

---

Build a production package

```sh
# builds the deployment package & starts a simple server to verify built code
yarn build && yarn start
```
