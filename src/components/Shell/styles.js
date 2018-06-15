import { css } from 'glamor';
import { desktop } from 'SRC/breakpoints';
import { headerHeight } from 'COMPONENTS/Header/styles';

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
    min-height: 100vh;
    flex-direction: column;
    display: flex;
  }

  header,
  footer {
    z-index: 1;
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  footer {
    position: relative;
  }

  .shell main {
    flex: 1;
  }

  ${ desktop } {
    .shell main {
      padding-top: calc(${ headerHeight } + 1em);
    }
  }
`);
