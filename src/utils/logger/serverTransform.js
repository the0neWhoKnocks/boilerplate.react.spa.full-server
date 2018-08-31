import 'colors';
import {
  BLACK_ON_GRAY,
  BLACK_ON_GREEN,
  BLACK_ON_RED,
  BLACK_ON_YELLOW,
  BLUE,
  BLUE_START,
  BLUE_END,
  GREEN_ON_BLACK,
} from './constants';

export default (arg) => {
  let result = arg;

  // list of colors https://www.npmjs.com/package/colors#colors-and-styles
  if(arg){
    if( result.includes(`${ BLUE_START } `) && result.includes(` ${ BLUE_END }`) )
      result = result.replace( RegExp(`${ BLUE_START } (.*) ${ BLUE_END }`), '$1'.blue.bold );

    if(result.includes(`${ BLACK_ON_GRAY } `)) result = ` ${ result.replace(`${ BLACK_ON_GRAY } `, '') } `.gray.bold.inverse;
    if(result.includes(`${ BLACK_ON_GREEN } `)) result = ` ${ result.replace(`${ BLACK_ON_GREEN } `, '') } `.green.bold.inverse;
    if(result.includes(`${ BLACK_ON_RED } `)) result = ` ${ result.replace(`${ BLACK_ON_RED } `, '') } `.red.bold.inverse;
    if(result.includes(`${ BLACK_ON_YELLOW } `)) result = ` ${ result.replace(`${ BLACK_ON_YELLOW } `, '') } `.yellow.bold.inverse;
    if(result.includes(`${ BLUE } `)) result = result.replace(`${ BLUE } `, '').blue.bold;
    if(result.includes(`${ GREEN_ON_BLACK } `)) result = ` ${ result.replace(`${ GREEN_ON_BLACK } `, '') } `.green.bold;
  }

  return {
    text: result,
  };
};
