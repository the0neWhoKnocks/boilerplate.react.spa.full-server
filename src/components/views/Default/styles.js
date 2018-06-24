import { css } from 'glamor';

const globals = () => {
  css.insert(`
    .is--ipsum header .logo svg {
      display: none;
    }
    .is--ipsum header .logo {
      width: 50px;
      height: 50px;
      padding: 0.25em;
      background-color: transparent;
    }
    .is--ipsum header .logo::before {
      content: '';
      width: 100%;
      height: 100%;
      background-size: cover;
      background-image: url('/media/bacon.png');
      display: block;
    }
    .is--ipsum .view::before {
      content: '';
      background-image: linear-gradient(#fff 27%, transparent), url('https://images4.alphacoders.com/764/thumb-1920-76488.jpg');
      opacity: 0.25;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  `);
};

export {
  globals,
};
