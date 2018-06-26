import { css } from 'glamor';

const spin = css.keyframes('spin', {
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

const styles = {
  root: css({
    textAlign: 'center',
    padding: '0.5em 1em',
    borderRadius: '0.3em',
    background: 'rgba(0, 0, 0, 0.4)',
    display: 'inline-block',

    '::before:not(:empty)': {
      content: 'attr(data-label)',
      color: '#fff',
      fontWeight: 'bold',
      marginRight: '0.5em',
      display: 'inline-block',
      verticalAlign: 'middle',
    },
  }),

  icon: css({
    width: '2em',
    height: '2em',
    borderRadius: '100%',
    border: 'solid 0.3em rgba(255,255,255,0.25)',
    borderTopColor: '#fff',
    animation: `${ spin } 0.5s linear infinite`,
    display: 'inline-block',
    verticalAlign: 'middle',
  }),
};

export default styles;
