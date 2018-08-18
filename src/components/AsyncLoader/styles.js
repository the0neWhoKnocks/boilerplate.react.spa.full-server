import { css } from 'glamor';

const fadeIn = css.keyframes('fadeIn', {
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
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
    opacity: 0,
    transition: 'opacity 0.5s',

    '.is--loading': {
      pointerEvents: 'all',
      opacity: 1,
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
    // for some reason, during a transition, if another `view` is added that has
    // scrollbars, and the content of the other view has center aligned items,
    // either with text-align or flex or margins - only the center aligned
    // content will shift to accomadate scrollbars (even if there are none
    // in that view). So for now, always show the scrollbar.
    overflowY: 'scroll',
    background: '#fff',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    '.is--ram': {
      backgroundColor: '#b3347c',
      backgroundImage: 'url(https://pre00.deviantart.net/4ef1/th/pre/f/2016/258/0/5/rick_and_morty_background_no_4_by_jurokoo-dahrvd7.png)',
      backgroundSize: 'cover',
      backgroundBlendMode: 'multiply',
    },
  }),

  fadeIn: css({
    animation: `${ fadeIn } 1s`,
  }),

  msg: css({
    padding: '1em',
    border: 'solid 0.2em',
    borderRadius: '0.5em',
    margin: '1em',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    overflow: 'auto',

    ' button': {
      color: 'inherit',
      padding: '0.5em 1em',
      border: 'solid 0.15em currentColor',
      borderRadius: '0.5em',
      marginLeft: '0.5em',
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      cursor: 'pointer',
    },

    '.is--error, .is--warning': {
      fontWeight: 'bold',
    },

    '.is--error': {
      color: '#fff',
      background: 'rgba(216, 37, 69, 0.85)',
    },

    '.is--warning': {
      color: '#ffbe00',
      background: 'rgba(41, 25, 0, 0.85)',
    },
  }),
};

export default styles;
