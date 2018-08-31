import { css } from 'glamor';

const spin = css.keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const styles = {
  overlay: ({
    bgColor,
  }) => {
    return css({
      background: bgColor,
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      transition: 'opacity 0.2s',
      opacity: 0,
      userSelect: 'none',
      pointerEvents: 'none',

      '.is--visible': {
        opacity: 1,
        userSelect: 'auto',
        pointerEvents: 'auto',
      },
    });
  },

  spinner: ({
    color,
    bgColor,
    size,
    speed,
    thickness,
  }) => css({
    width: '1em',
    height: '1em',
    fontSize: size,
    boxSizing: 'content-box',
    padding: '0.5em',
    background: bgColor,
    borderRadius: '100%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    '&::before': {
      content: `''`, // eslint-disable-line
      width: '100%',
      height: '100%',
      border: `solid ${ thickness } ${ color }25`,
      borderTopColor: color,
      borderRadius: '100%',
      boxSizing: 'border-box',
      display: 'block',
      animation: `${ spin } ${ speed } linear infinite`,
    },
  }),
};

export default styles;
