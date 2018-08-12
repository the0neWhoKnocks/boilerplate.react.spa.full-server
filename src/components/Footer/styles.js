import { css } from 'glamor';

const styles = {
  root: css({
    textAlign: 'right',
    padding: '1em',
    backgroundColor: '#dcdcdc',

    ' .toggle': {
      position: 'absolute',
    },
  }),

  link: css({
    color: '#333',
    textDecoration: 'none',
  }),
};

export default styles;
