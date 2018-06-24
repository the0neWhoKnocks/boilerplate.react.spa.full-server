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
    animationDuration: `${ animDuration }s`,
    animationFillMode: 'forwards', // stop on last frame, don't reset

    '.view-enter': {
      '.default': {
        animationName: viewEnter,
      },

      [`.${ RIGHT_TO_HOME }`]: {
        animationName: rightToHome,
      },
    },

    '.view-exit': {
      [`.${ HANG_IN_BACK }`]: {
        zIndex: 0,
      },

      [`.${ HOME_TO_RIGHT }`]: {
        animationName: homeToRight,
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
