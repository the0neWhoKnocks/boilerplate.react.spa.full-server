import { css } from 'glamor';
import { mobile } from 'SRC/breakpoints';

const loadFonts = () => {
  const fontURL = 'https://fonts.googleapis.com/css?family=Schoolbell';
  const linkTag = `<link href="${ fontURL }" rel="stylesheet">`;
  if(process.env.IS_CLIENT){
    // only load custom fonts once on the client
    if( !document.head.querySelector(`[href="${ fontURL }"]`) ){
      // add a link to the head so any further checks detect the already loaded
      // file.
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontURL;
      document.head.appendChild(link);
      // return the string tag so that there's no flash before the font loads
      return linkTag;
    }
  }
  else{
    return linkTag;
  }
};

const globals = () => {
  css.insert(`
    .is--ram header {
      color: #fff;
      background-color: #525252;
      box-shadow: 0 1px 0 0 #bcffbc;
    }
    .is--ram header .nav__btn::before {
      background: rgba(139, 255, 170, 0.25);
    }
    ${ mobile } {
      .is--ram header .nav__btn {
        background-color: #333;
      }
    }
  `);
};

const ITEM_COLOR = '#b8fb7b';
const ITEM_BG_COLOR = 'rgba(0, 0, 0, 0.5)';
const ITEM_LOADER_COLOR = '#5ddefe';

const styles = {
  title: css({
    color: ITEM_COLOR,
    fontFamily: 'Schoolbell, cursive',
    fontSize: '8vw',
    textShadow: '1px 2px 1px #dc7f88, 3px 3px 1px #355fa0, 5px 6px 1px #7235a0, 7px 8px 1px #396ba0',
    textAlign: 'center',
    marginBottom: '0.25em',

    [mobile]: {
      fontSize: '14vw',
    },
  }),

  grid: css({
    textAlign: 'center',
    lineHeight: 0,
  }),

  item: css({
    margin: '0.15em',
    borderRadius: '1em',
    overflow: 'hidden',
    border: `solid 0.5em ${ ITEM_COLOR }`,
    position: 'relative',
    display: 'inline-block',

    [mobile]: {
      width: '48%',
    },

    ' img': {
      width: '200px',
      height: '200px',
      display: 'block',

      [mobile]: {
        width: '100%',
        height: 'auto',
      },
    },

    ' .name': {
      transform: 'translateY(100%)',
      transition: 'transform 0.25s',
    },
    ':hover .name': {
      transform: 'translateY(0%)',
    },
  }),

  name: css({
    color: 'white',
    fontFamily: 'Schoolbell, cursive',
    fontSize: '1.25em',
    textAlign: 'center',
    lineHeight: '1em',
    textShadow: '2px 2px 1px #000000',
    background: 'linear-gradient(transparent, rgba(47, 3, 103, 0.5) 35%)',
    padding: '0.25em 0.5em',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  }),

  loadBar: css({
    color: ITEM_COLOR,
    lineHeight: '1em',
    padding: '1em',

    ' .spinner, span': {
      display: 'inline-block',
      verticalAlign: 'middle',
    },

    ' .spinner': {
      background: 'transparent',

      ' div': {
        border: `solid 0.3em ${ ITEM_COLOR }40`,
        borderTopColor: ITEM_COLOR,
      },
    },

    ' span': {
      fontSize: '1.5em',
    },
  }),
};

export default styles;
export {
  ITEM_BG_COLOR,
  ITEM_LOADER_COLOR,
  globals,
  loadFonts,
};
