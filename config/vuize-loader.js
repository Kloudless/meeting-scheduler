const fs = require('fs');
const combine = require('./vue-combine');

/**
 * A webpack loader to read vue component script js file and combine it with
 * template and styles under the same folder to generate single file
 * vue component.
 */
module.exports = function vuizeLoader(source) {
  const result = combine(source, this.resourcePath);

  // write the output to .vue file so that vue-loader could pick it up
  // this also makes supporting source-map possible
  this.resourcePath = this.resourcePath.replace('.js', '.vue');
  result.resources.forEach((resourcePath) => {
    // track changes for template and styles
    this.addDependency(resourcePath);
  });
  fs.writeFileSync(this.resourcePath, result.source, 'utf-8');

  return result.source;
};
