import { css } from 'glamor';
import { mobile } from 'SRC/breakpoints';

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

const styles = {
  view: css({
    backgroundColor: '#b3347c',
    backgroundImage: 'url(https://pre00.deviantart.net/4ef1/th/pre/f/2016/258/0/5/rick_and_morty_background_no_4_by_jurokoo-dahrvd7.png)',
    backgroundSize: 'cover',
    backgroundBlendMode: 'multiply',
  }),

  title: css({
    color: '#b8fb7b',
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
    border: 'solid 0.5em #b8fb7b',
    position: 'relative',
    display: 'inline-block',

    ' img': {
      width: '200px',
      height: '200px',
      display: 'block',

      [mobile]: {
        width: '170px',
        height: '170px',
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
};

export default styles;
export {
  globals,
};
