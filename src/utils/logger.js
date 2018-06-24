import 'colors';

const BLACK_ON_GRAY = '%blackgray';
const BLACK_ON_GREEN = '%blackgreen';
const BLACK_ON_YELLOW = '%blackyellow';
const BLUE = '%blue';
const GREEN_ON_BLACK = '%greenblack';

// NOTE - newlines work in node, but you need another log on the client if
// you're adding messages with color.

function logger(){
  const args = Array.from(arguments);
  const msg = [];
  let clientStyles = [];

  args.forEach((arg) => {
    let text = arg;

    if( process.env.IS_CLIENT ){
      const blockStyles = 'padding:0.25em 0.5em; border-radius:0.5em;';
      const styleReset = 'color:#000; background:transparent;';

      if(arg.includes(`${ BLACK_ON_GRAY } `)){
        text = arg.replace(`${ BLACK_ON_GRAY } `, '%c') + '%c';
        clientStyles.push(`color:#eee; background:gray; ${ blockStyles }`, styleReset);
      }
      if(arg.includes(`${ BLACK_ON_GREEN } `)){
        text = arg.replace(`${ BLACK_ON_GREEN } `, '%c') + '%c';
        clientStyles.push(`color:#000; background:limegreen; ${ blockStyles }`, styleReset);
      }
      if(arg.includes(`${ BLACK_ON_YELLOW } `)){
        text = arg.replace(`${ BLACK_ON_YELLOW } `, '%c') + '%c';
        clientStyles.push(`color:#000; background:yellow; ${ blockStyles }`, styleReset);
      }
      if(arg.includes(`${ BLUE } `)){
        text = arg.replace(`${ BLUE } `, '%c') + '%c';
        clientStyles.push('color:blue;', styleReset);
      }
      if(arg.includes(`${ GREEN_ON_BLACK } `)){
        text = arg.replace(`${ GREEN_ON_BLACK } `, '%c') + '%c';
        clientStyles.push(`color:#bada55; background:#222; ${ blockStyles }`, styleReset);
      }
    }
    else{
      // list of colors https://www.npmjs.com/package/colors#colors-and-styles
      if(arg.includes(`${ BLACK_ON_GRAY } `)) text = ` ${ arg.replace(`${ BLACK_ON_GRAY } `, '') } `.gray.bold.inverse;
      if(arg.includes(`${ BLACK_ON_GREEN } `)) text = ` ${ arg.replace(`${ BLACK_ON_GREEN } `, '') } `.green.bold.inverse;
      if(arg.includes(`${ BLACK_ON_YELLOW } `)) text = ` ${ arg.replace(`${ BLACK_ON_YELLOW } `, '') } `.yellow.bold.inverse;
      if(arg.includes(`${ BLUE } `)) text = arg.replace(`${ BLUE } `, '').blue.bold;
      if(arg.includes(`${ GREEN_ON_BLACK } `)) text = ` ${ arg.replace(`${ GREEN_ON_BLACK } `, '') } `.green.bold;
    }

    msg.push(text);
  });

  console.log(msg.join(' '), ...clientStyles);
}

export default logger;
export {
  BLACK_ON_GREEN,
  BLACK_ON_GRAY,
  BLUE,
  GREEN_ON_BLACK,
};
