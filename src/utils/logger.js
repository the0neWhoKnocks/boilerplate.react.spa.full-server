import cliColor from 'cli-color';

function logger(){
  const args = Array.from(arguments);
  const msg = [];

  args.forEach((arg) => {
    let m = arg;
    let extra;

    if( process.env.IS_CLIENT ){
      let styles = 'padding:0.25em 0.5em; border-radius:0.5em';

      if(arg.indexOf('%bg ') > -1){
        m = arg.replace('%bg ', '%c');
        extra = `color:#000; background:limegreen; ${ styles }`;
      }
      if(arg.indexOf('%gb ') > -1){
        m = arg.replace('%gb ', '%c');
        extra = `color:#bada55; background:#222; ${ styles }`;
      }
      if(arg.indexOf('%b ') > -1){
        m = arg.replace('%b ', '%c');
        extra = `color:blue; ${ styles }`;
      }
    }
    else{
      if(arg.indexOf('%bg ') > -1) m = `${ cliColor.green.bold.inverse(` ${ arg.replace('%bg ', '') } `) }`;
      if(arg.indexOf('%gb ') > -1) m = `${ cliColor.green.bold(` ${ arg.replace('%gb ', '') } `) }`;
      if(arg.indexOf('%b ') > -1) m = `${ cliColor.blue.bold(arg.replace('%b ', '')) } `;
    }

    msg.push(m);
    if(extra) msg.push(extra);
  });

  console.log(...msg);
}

export default logger;
