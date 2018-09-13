import { css } from 'glamor';
import { mobile } from 'SRC/breakpoints';

const genRandomColors = (steps = 50) => {
  const hexVals = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
  let anim = '';

  for(let perc=0; perc<steps; perc++){
    let currHex = '';

    for(let i=0; i<3; i++){
      currHex += hexVals[ Math.floor(Math.random() * 15)];
    }

    anim += `${ perc }%{color:#${ currHex };}`;
  }

  return anim;
};

const headerHeight = '3.1em';

// randomly generated rules can't be hydrated, so insert them as globals
css.insert(`
  @keyframes disco{${ genRandomColors() }}
  @webkit-keyframes disco{${ genRandomColors() }}
`);
const styles = {
  header: css({
    height: headerHeight,
    backgroundColor: '#dcdcdc',

    '::before': {
      content: "''",
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: '#000',
      opacity: 0,
      transition: 'opacity 0.25s',
    },

    [mobile]: {
      position: 'relative',

      // add a background color element so the nav can go under
      '::before': {
        opacity: 1,
      },
    },
  }),

  nav: css({
    display: 'inline-block',

    [mobile]: {
      background: '#fff',
      boxShadow: '0 5px 2em rgba(0,0,0,0.5)',
      position: 'absolute',
      bottom: '2em', // account for shadow
      left: 0,
      right: 0,
      transform: 'translateY(0%)',
      transition: 'transform 0.25s ease-in-out',
      zIndex: '-1',

      '.is--open': {
        transform: 'translateY(calc(100% + 2em))',
      },
    },
  }),

  navLogo: css({
    color: '#fff', // default color
    height: '100%',
    background: '#000',
    display: 'inline-block',
    verticalAlign: 'top',
    animation: 'disco 100s linear infinite',

    ' svg': {
      height: '100%',
      padding: '0.25em',
    },

    [mobile]: {
      position: 'relative',
    },
  }),

  navBtn: css({
    color: 'currentColor',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: '1em 1.5em',
    border: 'solid 1px #AAA',
    borderTop: 'none',
    borderBottom: 'none',
    display: 'inline-block',
    position: 'relative',

    ' ~ .nav__btn': {
      marginLeft: '-1px',
    },

    '::before': {
      content: "''",
      background: 'rgba(0, 0, 0, 0.25)',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      transition: 'transform 0.2s',
      transformOrigin: 'bottom center',
      transform: 'scale(1, 0)',
      pointerEvents: 'none',
    },

    ':hover': {
      '&::before': {
        transform: 'scale(1, 0.1)',
      },
    },

    '.current': {
      '&::before': {
        transform: 'scale(1, 1)',
      },
    },

    [mobile]: {
      border: 'solid 1px #aaa',
      borderLeft: 'none',
      borderRight: 'none',
      display: 'block',

      ' ~ .nav__btn': {
        marginLeft: 0,
        marginTop: '-1px',
      },

      '::before': {
        transformOrigin: 'center left',
        transform: 'scale(0, 1)',
        pointerEvents: 'none',
      },

      ':hover': {
        '&::before': {
          transform: 'scale(0.02, 1)',
        },
      },

      '.current': {
        '&::before': {
          transform: 'scale(1, 1)',
        },
      },
    },
  }),

  toggle: css({
    display: 'none',
    position: 'absolute',
    top: 0,
    right: 0,

    [mobile]: {
      display: 'block',
    },
  }),

  toggleLabel: css({
    color: '#fff',
    padding: '1em',
    userSelect: 'none',
    cursor: 'pointer',
    display: 'block',
  }),

  toggleInput: css({
    display: 'none',

    ':checked + .toggle__indicator': {
      display: 'block',
    },
  }),

  toggleIndicator: css({
    width: '0.25em',
    height: '50%',
    background: '#666',
    display: 'none',
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
  }),
};

export default styles;
export {
  headerHeight,
};
