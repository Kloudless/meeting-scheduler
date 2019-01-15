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
  this.addDependency(filePath);

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

module.exports = function vuizeLoader(source) {
  // We need to use the source because it could have been transformed already.
  // e.g. For code coverage tracking.
  let vueFileContents = `<script>\n${source}\n</script>\n`;

  // Get other files
  const resourcePath = path.resolve(__dirname, this.resourcePath);
  const dirPath = path.dirname(resourcePath);

  fs.readdirSync(dirPath).forEach((fname) => {
    if (/(^\.|^#.+#$)/.test(fname)) {
      // Ignore hidden and temporary files
      return;
    }

    const filePath = path.resolve(dirPath, fname);
    const ext = path.extname(filePath);
    if (cssLangMap[ext]) {
      vueFileContents += getElementData.call(
        this, 'style', cssLangMap[ext], filePath,
      );
    } else if (htmlLangMap[ext]) {
      vueFileContents += getElementData.call(
        this, 'template', htmlLangMap[ext], filePath,
      );
    }
  });

  // write the output to .vue file so that vue-loader could pick it up
  // this also makes supporting source-map possible
  this.resourcePath = this.resourcePath.replace('.js', '.vue');
  fs.writeFileSync(this.resourcePath, vueFileContents, 'utf-8');


  return vueFileContents;
};
