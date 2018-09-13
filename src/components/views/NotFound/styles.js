import { css } from 'glamor';

const styles = {
  root: css({
    height: '100%',
    padding: '2em',
    overflow: 'auto',
  }),
  
  icon: css({
    color: '#eee',
    width: '90%',
    height: '90%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 0,
    
    ' svg': {
      width: '100%',
      height: '100%',
      margin: '0 auto',
    },
  }),
  
  info: css({
    width: '100%',
    fontSize: '2rem',
    position: 'absolute',
    zIndex: 1,
    textShadow: '0px 4px 2px #fff, 0px 4px 2px #fff, 0px 4px 2px #fff, 0px 4px 2px #fff',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  }),
};

export default styles;