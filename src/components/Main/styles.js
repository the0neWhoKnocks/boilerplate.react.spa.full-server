import { css } from 'glamor';

const animDuration = 0.5;
const HANG_IN_BACK = 'hang-in-back';
const HOME_TO_RIGHT = 'home-to-right';
const RIGHT_TO_HOME = 'right-to-home';

const viewEnter = css.keyframes('view-enter', {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
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

const rightToHome = css.keyframes('right-to-home', {
  '0%': {
    transform: 'translateX(100%)',
  },
  '100%': {
    transform: 'translateX(0%)',
  },
});

const homeToRight = css.keyframes('home-to-right', {
  '0%': {
    transform: 'translateX(0%)',
  },
  '100%': {
    transform: 'translateX(100%)',
  },
});

const styles = {
  viewTransition: css({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    transform: 'translateX(0%)',

    '.view-enter': {
      '.default': {
        animation: `${ viewEnter } ${ animDuration }s`,
      },

      [`.${ RIGHT_TO_HOME }`]: {
        animation: `${ rightToHome } ${ animDuration }s`,
      },
    },

    '.view-exit': {
      '.default': {
        animation: `${ viewExit } ${ animDuration }s`,
      },

      [`.${ HANG_IN_BACK }`]: {
        animation: 'none',
        zIndex: 0,
      },

      [`.${ HOME_TO_RIGHT }`]: {
        animation: `${ homeToRight } ${ animDuration }s`,
        zIndex: 1,
      },
    },
  }),
};

export default styles;
export {
  HANG_IN_BACK,
  HOME_TO_RIGHT,
  RIGHT_TO_HOME,
  animDuration,
};
