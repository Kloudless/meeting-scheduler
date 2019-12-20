const common = require('./config/common');
const packages = require('./package.json');

/**
 * Define build options environment variables here
 * format: [var name]: default value
 * check README for variable names and purpose
 */
const buildEnvVarDefaults = {
  BASE_URL: 'https://api.kloudless.com',
  SCHEDULE_URL: 'https://kloudl.es/m/s/MEETING_WINDOW_ID',
  SCHEDULER_PATH:
    'https://static-cdn.kloudless.com/p/platform/scheduler/index.html',
  // for development only
  KLOUDLESS_APP_ID: '',
};

const transformDefines = {
  // used in authenticator
  DEBUG: false,
  // constants
  VERSION: packages.version,
  MESSAGE_PREFIX: `${packages.name}/`,
};

Object.keys(buildEnvVarDefaults).forEach((varName) => {
  transformDefines[varName]
    = process.env[varName] || buildEnvVarDefaults[varName];
});

const vueEsModuleAlias = {
  vue: 'vue/dist/vue.esm.js',
};

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
      },
    ],
  ],
  plugins: [
    [
      'module-resolver', {
        root: common.resolvePaths,
      },
    ],
    [
      'transform-define',
      transformDefines,
    ],
  ],
  ignore: common.ignorePaths,
  env: {
    /**
     * vue alias should not be applied when env is "test",
     * otherwise, Jest will be failed with syntax errors.
     */
    development: {
      plugins: [
        [
          'module-resolver', {
            root: common.resolvePaths,
            alias: vueEsModuleAlias,
          },
        ],
      ],
    },
    production: {
      plugins: [
        [
          'module-resolver', {
            root: common.resolvePaths,
            alias: vueEsModuleAlias,
          },
        ],
      ],
    },
  },
};
