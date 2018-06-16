import { css } from 'glamor';

const disco = (steps) =>
  css.keyframes(`disco_${ steps }`, genRandomColors(steps));

const genRandomColors = (steps = 50) => {
  const hexVals = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
  let anim = {};

  for(let perc=0; perc<steps; perc++){
    let currHex = '';

    for(let i=0; i<3; i++){
      currHex += hexVals[ Math.floor(Math.random() * 15)];
    }

    anim[`${ perc }%`] = {
      color: `#${ currHex }`,
    };
  }

  return anim;
};

const styles = {
  wrapper: css({
    color: '#fff', // default color
    animation: `${ disco() } 100s linear infinite`,

    ' svg': {
      display: 'block',
    },
  }),
};

export default styles;
