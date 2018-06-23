import { css } from 'glamor';

const animDuration = 0.5;

const viewEnter = css.keyframes('view-enter', {
  '0%': {
    opacity: 0,
    transform: 'translateX(25%)',
  },
  '100%': {
    opacity: 1,
    transform: 'translateX(0%)',
  },
});
const viewExit = css.keyframes('view-exit', {
  '0%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

const styles = {
  overlay: css({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    pointerEvents: 'none',

    '.is--loading': {
      pointerEvents: 'all',
    },
  }),

  spinner: css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }),

  view: css({
    padding: '1em',
    overflow: 'auto',
    background: '#fff',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    transform: 'translateX(0%)',

    '.view-enter': {
      animation: `${ viewEnter } ${ animDuration }s`,
      zIndex: 1,
    },

    '.view-exit': {
      animation: `${ viewExit } ${ animDuration }s`,
    },
  }),
};

export default styles;
export {
  animDuration,
};
