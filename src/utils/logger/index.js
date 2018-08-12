import { getCookie } from 'UTILS/cookie';

export * from './constants';

export default function logger() {
  let transformer;
  let transform;

  if(process.env.IS_CLIENT){
    transformer = (getCookie('logging'))
      ? import(/* webpackChunkName: "clientLogger" */ './clientTransform')
      : Promise.resolve({ default: () => {} });
  }
  else{
    transformer = Promise.resolve( require('./serverTransform') );
  }

  transformer.then((module) => {
    transform = module.default;

    const args = Array.from(arguments);
    const msg = [];
    const styles = [];

    args.forEach((arg) => {
      const result = transform(arg);

      if(result){
        if( process.env.IS_CLIENT ) styles.push(...result.styles);
        msg.push(result.text);
      }
    });

    if(msg.length) console.log(msg.join(' '), ...styles);
  });
}
