const path = require('path');
const common = require('../../../config/common');

module.exports = {
  rootDir: path.resolve(__dirname, '../../../'),
  moduleFileExtensions: [
    'vue',
    'js',
  ],
  transform: {
    '.*\\.(vue)$': 'jest-vue-preprocessor',
    '.*\\.(css|scss)$': '<rootDir>/test/unit/jest/null-transformer',
    '.*\\.(js)$': 'babel-jest',
  },
  transformIgnorePatterns: common.ignorePaths.map(regExp => regExp.source),
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/jest/setup'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/view/router/index.js',
    '!**/node_modules/**',
    '!<rootDir>/test/**',
  ],
  // set jestWebpackResolver in package.json to silent jest
  // config validation warning
  roots: [
    '<rootDir>/test/unit',
  ],
};
