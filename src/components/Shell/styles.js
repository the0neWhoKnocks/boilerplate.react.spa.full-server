import { css } from 'glamor';

css.insert(`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  body {
    font: 16px Helvetica, Arial, sans-serif;
  }

  h1 {
    margin-top: 0;
  }

  .root,
  .shell {
    height: 100%;
  }

  .shell {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  header,
  footer {
    flex-shrink: 0;
    position: relative;
  }

  header {
    z-index: 5;
  }

  .shell main {
    min-height: 2em;
    overflow: hidden;
    flex-grow: 1;
    position: relative;
  }
`);
