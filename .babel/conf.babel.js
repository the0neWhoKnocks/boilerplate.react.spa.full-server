const { writeFileSync } = require('fs');

// NOTE - This is here to cut down on config duplication.
//
// NOTE - Babel 7 supports a JS config https://babeljs.io/docs/en/next/babelconfigjs.html
// but would require a refactor of existing code to implement.
//
// NOTE - All paths referenced in `conf` are relative to the root of the repo
// where the `.babelrc` file will be generated.

const clientConfig = {
  presets: [
    'react-app',
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
          'config': './.webpack/conf.webpack.js',
        }],
        'dynamic-import-node',
        'transform-object-rest-spread',
        'transform-react-jsx',
      ],
      presets: [
        ['env', {
          'targets': {
            'node': 'current',
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
