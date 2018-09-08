# TODO

- [ ] Figure out what can be ripped out from the `create-react-app` boilerplate.
  - Candidates
    - `config/paths.js`
- [x] Condense WebPack configs into just one.
- [ ] Swap out server logs with something else
  - https://blog.risingstack.com/node-js-logging-tutorial/
- [ ] Think of a better way to generate and access cache keys
  - [ ] Cache responses locally so server loads are faster.
    - https://www.npmjs.com/package/express-redis-cache
    - https://medium.com/the-node-js-collection/simple-server-side-cache-for-express-js-with-node-js-45ff296ca0f0
    - https://www.npmjs.com/package/flat-cache
      - https://scotch.io/tutorials/how-to-optimize-node-requests-with-simple-caching-strategies
