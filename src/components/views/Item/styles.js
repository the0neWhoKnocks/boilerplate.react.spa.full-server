import { css } from 'glamor';
import { mobile } from 'SRC/breakpoints';
import itemsStyles from 'COMPONENTS/views/Items/styles';

const maxImgSize = '300px';

const styles = {
  root: css({
    textAlign: 'center',

    ' label': {
      fontWeight: 'bold',

      '::after': {
        content: ':', // eslint-disable-line
        paddingRight: '0.25em',
      },
    },
  }),

  title: itemsStyles.title,
  view: itemsStyles.view,

  img: css({
    width: maxImgSize,
    height: maxImgSize,
    borderRadius: '1em',
    overflow: 'hidden',
    border: 'solid 0.5em #b8fb7b',

    [mobile]: {
      width: '100%',
      maxWidth: maxImgSize,
      height: 'auto',
    },
  }),

  info: css({
    color: 'white',
    fontSize: '2em',
    fontFamily: 'monospace',
    textAlign: 'left',
    listStyle: 'none',
    display: 'inline-block',
    verticalAlign: 'top',

    ' label': {
      color: '#66f0ff',
      textShadow: '1px 1px 1px #481313, 2px 2px 1px #11366f, 3px 3px 1px #64136b, 4px 4px 1px #7444bf',
    },

    [mobile]: {
      fontSize: '1.4em',
      padding: 0,
    },
  }),

  backBtn: css({
    padding: '1em',

    ' a': {
      fontSize: '1.5em',
      textDecoration: 'none',
      color: '#b8fb7b',
      border: 'solid 2px rgba(255, 255, 255, 0.23921568627450981)',
      borderRadius: '0.25em',
      background: 'rgba(115, 37, 112, 0.5)',
      padding: '0.25em 1em',
    },
  }),
};

export default styles;
