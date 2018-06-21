import { css } from 'glamor';

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
};

export default styles;
