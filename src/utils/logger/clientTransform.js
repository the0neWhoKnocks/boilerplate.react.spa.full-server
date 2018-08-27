import {
  BLACK_ON_GRAY,
  BLACK_ON_GREEN,
  BLACK_ON_RED,
  BLACK_ON_YELLOW,
  BLUE,
  GREEN_ON_BLACK,
} from './constants';

// NOTE - newlines work in node, but you need another log on the client if
// you're adding messages with color.

const blockStyles = 'padding:0.25em 0.5em; border-radius:0.5em;';
const styleReset = 'color:#000; background:transparent;';

export default (arg) => {
  const styles = [];
  let result = arg;

  if(arg){
    if(arg.includes(`${ BLACK_ON_GRAY } `)){
      result = arg.replace(`${ BLACK_ON_GRAY } `, '%c') + '%c';
      styles.push(`color:#eee; background:gray; ${ blockStyles }`, styleReset);
    }
    if(arg.includes(`${ BLACK_ON_GREEN } `)){
      result = arg.replace(`${ BLACK_ON_GREEN } `, '%c') + '%c';
      styles.push(`color:#000; background:limegreen; ${ blockStyles }`, styleReset);
    }
    if(arg.includes(`${ BLACK_ON_RED } `)){
      result = arg.replace(`${ BLACK_ON_RED } `, '%c') + '%c';
      styles.push(`color:#000; background:red; ${ blockStyles }`, styleReset);
    }
    if(arg.includes(`${ BLACK_ON_YELLOW } `)){
      result = arg.replace(`${ BLACK_ON_YELLOW } `, '%c') + '%c';
      styles.push(`color:#000; background:yellow; ${ blockStyles }`, styleReset);
    }
    if(arg.includes(`${ BLUE } `)){
      result = arg.replace(`${ BLUE } `, '%c') + '%c';
      styles.push('color:blue;', styleReset);
    }
    if(arg.includes(`${ GREEN_ON_BLACK } `)){
      result = arg.replace(`${ GREEN_ON_BLACK } `, '%c') + '%c';
      styles.push(`color:#bada55; background:#222; ${ blockStyles }`, styleReset);
    }
  }

  return {
    styles,
    text: result,
  };
};
