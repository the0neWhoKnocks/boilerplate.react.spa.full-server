import 'colors';
import {
  BLACK_ON_GRAY,
  BLACK_ON_GREEN,
  BLACK_ON_RED,
  BLACK_ON_YELLOW,
  BLUE,
  GREEN_ON_BLACK,
} from './constants';

export default (arg) => {
  let result = arg;

  if(arg){
    // list of colors https://www.npmjs.com/package/colors#colors-and-styles
    if(arg.includes(`${ BLACK_ON_GRAY } `)) result = ` ${ arg.replace(`${ BLACK_ON_GRAY } `, '') } `.gray.bold.inverse;
    if(arg.includes(`${ BLACK_ON_GREEN } `)) result = ` ${ arg.replace(`${ BLACK_ON_GREEN } `, '') } `.green.bold.inverse;
    if(arg.includes(`${ BLACK_ON_RED } `)) result = ` ${ arg.replace(`${ BLACK_ON_RED } `, '') } `.red.bold.inverse;
    if(arg.includes(`${ BLACK_ON_YELLOW } `)) result = ` ${ arg.replace(`${ BLACK_ON_YELLOW } `, '') } `.yellow.bold.inverse;
    if(arg.includes(`${ BLUE } `)) result = arg.replace(`${ BLUE } `, '').blue.bold;
    if(arg.includes(`${ GREEN_ON_BLACK } `)) result = ` ${ arg.replace(`${ GREEN_ON_BLACK } `, '') } `.green.bold;
  }

  return {
    text: result,
  };
};
