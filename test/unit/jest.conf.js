const path = require('path');
const packages = require('../../package.json');

// vue|compact-timezone-list|...
const dependenciesPattern = Object.keys(packages.dependencies).join('|');

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'vue',
  ],
  transform: {
    'components/.*index\\.js$': 'vue-separate-jest',
    '.*\\.(js)$': 'babel-jest',
  },
  // for scripts in node_modules, only apply babel for dependencies
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(${dependenciesPattern}))`,
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/router/index.js',
    '!**/node_modules/**',
    '!<rootDir>/test/**',
  ],
  resolver: 'jest-webpack-resolver',
  // set jestWebpackResolver in package.json to silent jest
  // config validation warning
  roots: [
    '<rootDir>/test/unit',
  ],
  globals: {
    BASE_URL: 'http://localhost:8002',
    DEBUG: false,
  },
};
