const { writeFileSync } = require('fs');

// NOTE - This is here to cut down on config duplication.
//
// NOTE - Babel 7 supports a JS config https://babeljs.io/docs/en/next/babelconfigjs.html
// but would require a refactor of existing code to implement.
//
// NOTE - All paths referenced in `conf` are relative to the root of the repo
// where the `.babelrc` file will be generated.

const appendChunkProps = [
  './.babel/plugins/appendChunkProps.js',
  {
    // NOTE - The default is `react-loadable`. This doesn't allow for HOC's or
    // composition, so the original `react-loadable/babel` plugin was augmented
    // to allow for customization.
    components: [
      'composeChunk',
    ],
    // NOTE - If you want the plugin to target another prop instead of the
    // default `loader`, change the below to another value.
    loaderProp: 'load',
  },
];

const clientConfig = {
  presets: [
    'react-app',
  ],
  plugins: [
    appendChunkProps,
    'syntax-dynamic-import',
  ],
};
const conf = {
  env: {
    development: clientConfig,
    production: clientConfig,
    server: {
      ignore: [
        '**/*.test.js',
        '**/test.js',
      ],
      plugins: [
        ['webpack-alias', {
          config: './.webpack/conf.webpack.js',
        }],
        ['transform-define', {
          'process.env.IS_CLIENT': false,
          'process.env.IS_SERVER': true,
        }],
        'dynamic-import-node',
        ['import-inspector', {
          'serverSideRequirePath': true,
          'webpackRequireWeakId': true,
        }],
        appendChunkProps,
        'syntax-dynamic-import',
        'transform-object-rest-spread',
        'transform-react-jsx',
      ],
      presets: [
        ['env', {
          targets: {
            node: 'current',
          },
        }],
      ],
    },
    test: clientConfig,
  },
};

try {
  writeFileSync('./.babelrc', `${ JSON.stringify(conf, null, 2) }\n`);
}catch(err) {
  throw err;
}
