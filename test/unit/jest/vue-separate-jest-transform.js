const jestVuePreprocessor = require('jest-vue-preprocessor');
const combine = require('../../../config/vue-combine');

module.exports = {
  process(src, filePath, jestConfig) {
    const { source } = combine(src, filePath);
    return jestVuePreprocessor.process(source, filePath, jestConfig);
  },
};
