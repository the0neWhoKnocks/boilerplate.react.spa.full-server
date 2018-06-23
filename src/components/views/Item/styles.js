import { css } from 'glamor';

const styles = {
  root: css({

    ' label': {
      fontWeight: 'bold',      

      '::after': {
        content: ':', // eslint-disable-line
        paddingRight: '0.25em',
      },
    },
  }),
};

export default styles;
