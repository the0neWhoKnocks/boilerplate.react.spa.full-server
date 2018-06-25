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
  view: css(itemsStyles.view, {
    [mobile]: {
      '.has--back-btn': {
        paddingTop: '2.5em',
      },
    },
  }),

  infoWrapper: css({
    display: 'inline-flex',

    [mobile]: {
      display: 'block',
    },
  }),

  img: css({
    width: maxImgSize,
    height: maxImgSize,
    borderRadius: '1em',
    overflow: 'hidden',
    border: 'solid 0.5em #b8fb7b',
    flexShrink: 0,

    [mobile]: {
      width: '100%',
      maxWidth: maxImgSize,
      height: 'auto',
    },
  }),

  info: css({
    color: 'white',
    fontSize: '1.75em',
    fontFamily: 'monospace',
    textAlign: 'left',
    listStyle: 'none',
    paddingLeft: '0.5em',
    margin: 0,

    ' li': {
      padding: '0.25em 0',
      borderTop: 'dashed 1px rgba(102, 240, 255, 0.5)',

      ':first-of-type': {
        paddingTop: 0,
        border: 'none',
      },
    },

    ' label, span': {
      display: 'inline-block',
    },

    ' label': {
      color: '#66f0ff',
      textShadow: '1px 1px 1px #481313, 2px 2px 1px #11366f, 3px 3px 1px #64136b, 4px 4px 1px #7444bf',
    },

    ' span': {
      paddingLeft: '0.5em',
    },

    [mobile]: {
      fontSize: '1.4em',
      padding: 0,
      marginTop: '0.5em',
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

    [mobile]: {
      fontSize: '0.6em',
      textAlign: 'right',
      background: 'rgba(0, 0, 0, 0.75)',
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
    },
  }),
};

export default styles;
