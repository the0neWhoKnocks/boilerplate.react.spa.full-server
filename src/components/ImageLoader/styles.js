import { css } from 'glamor';

const REVEAL_DURATION = 0.25;
const styles = {
  img: css({
    width: '100%',
    display: 'block',
    opacity: 0,
    transition: `opacity ${ REVEAL_DURATION }s`,

    '.is--loaded': {
      opacity: 1,
    },
  }),
};

export default styles;
export {
  REVEAL_DURATION,
};
