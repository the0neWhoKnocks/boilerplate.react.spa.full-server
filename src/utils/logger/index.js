export * from './constants';

export default function logger() {
  const transform = (process.env.IS_CLIENT)
    ? require('./clientTransform').default
    : require('./serverTransform').default;

  const args = Array.from(arguments);
  const msg = [];
  const styles = [];

  args.forEach((arg) => {
    const result = transform(arg);

    if( process.env.IS_CLIENT ) styles.push(...result.styles);
    msg.push(result.text);
  });

  console.log(msg.join(' '), ...styles);
}
