const common = require('./config/common');
const packages = require('./package.json');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['chrome > 70', 'firefox > 63'],
        useBuiltIns: 'usage',
      },
    ],
  ],
  plugins: [
    [
      'module-resolver', {
        root: common.resolvePaths,
        alias: {
          vue: 'vue/dist/vue.esm.js',
        },
      },
    ],
    [
      'transform-define',
      {
        BASE_URL: process.env.BASE_URL || 'https://api.kloudless.com',
        KLOUDLESS_APP_ID: process.env.KLOUDLESS_APP_ID,
        KLOUDLESS_API_KEY: process.env.KLOUDLESS_API_KEY,
        VERSION: packages.version,
        SCHEDULER_PATH: process.env.SCHEDULER_PATH,
        // used in authenticator js
        DEBUG: false,
        MESSAGE_PREFIX: `${packages.name}/`,
      },
    ],
  ],
  ignore: common.ignorePaths,
};
