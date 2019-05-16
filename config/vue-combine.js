const path = require('path');
const fs = require('fs');

const cssLangMap = {
  '.css': 'css',
  '.styl': 'stylus',
  '.scss': 'scss',
  '.scoped.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',
};

const htmlLangMap = {
  '.html': 'html',
  '.pug': 'pug',
};

function getElementData(tagName, lang, filePath) {
  let attrString = '';
  if (lang) {
    attrString += ` lang="${lang}"`;
  }
  if (tagName === 'style' && filePath.indexOf('.scoped.') > -1) {
    attrString += ' scoped';
  }
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  return `\n<${tagName}${attrString}>\n${fileContents}\n</${tagName}>\n`;
}

/**
 * Combine vue template, styles, and script into one string and return
 * @param {String} jsSource component script content
 * @param {String} jsFilePath path to the component script file
 *
 * Return value: Object
 * {
 *   source: String, combined source code
 *   resources: Array, a list of template or style file paths
 *                     that are used to generate output source.
 * }
 */
function combine(jsSource, jsFilePath) {
  // We need to use the source because it could have been transformed already.
  // e.g. For code coverage tracking.
  let vueFileContents = `<script>\n${jsSource}\n</script>\n`;
  const includeResources = [];

  // Get other files
  const resourcePath = path.resolve(__dirname, jsFilePath);
  const dirPath = path.dirname(resourcePath);

  fs.readdirSync(dirPath).forEach((fname) => {
    if (/(^\.|^#.+#$)/.test(fname)) {
      // Ignore hidden and temporary files
      return;
    }

    const filePath = path.resolve(dirPath, fname);
    const ext = path.extname(filePath);
    if (cssLangMap[ext]) {
      includeResources.push(filePath);
      vueFileContents += getElementData('style', cssLangMap[ext], filePath);
    } else if (htmlLangMap[ext]) {
      includeResources.push(filePath);
      vueFileContents += getElementData('template', htmlLangMap[ext], filePath);
    }
  });

  return {
    source: vueFileContents,
    resources: includeResources,
  };
}

module.exports = combine;
