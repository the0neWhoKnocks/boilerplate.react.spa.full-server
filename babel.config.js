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
    ['@babel/preset-env', {
      targets: {
        chrome: 58,
        ie: 11,
      },
    }],
    // '@babel/preset-react',
    'react-app',
  ],
  plugins: [
    appendChunkProps,
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-arrow-functions',
  ],
};

module.exports = {
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
        ['transform-define', {
          'process.env.IS_CLIENT': false,
          'process.env.IS_SERVER': true,
        }],
        'dynamic-import-node-babel-7',
        appendChunkProps,
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-react-jsx',
      ],
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current',
          },
        }],
      ],
    },
    test: clientConfig,
  },
};
