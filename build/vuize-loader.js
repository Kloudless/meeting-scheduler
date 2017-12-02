var path = require('path')
var fs = require('fs')

module.exports = function (source) {
  this.cacheable()

  // We need to use the source because it could have been transformed already.
  // e.g. For code coverage tracking.
  var vueFileContents = `<script>${source}</script>`

  // Get other files

  var cssLangMap = {
    '.css': 'css',
    '.styl': 'stylus',
    '.scss': 'scss',
    '.scoped.scss': 'scss',
    '.sass': 'sass',
    '.less': 'less'
  }
  var htmlLangMap = {
    '.html': 'html',
    '.pug': 'pug'
  }

  var resourcePath = path.resolve(__dirname, this.resourcePath)
  var dirPath = path.dirname(resourcePath)

  fs.readdirSync(dirPath).forEach((fname) => {
    if (/(^\.|^#.+#$)/.test(fname)) {
      // Ignore hidden and temporary files
      return
    }

    var filePath = path.resolve(dirPath, fname)
    var ext = path.extname(filePath)
    if (cssLangMap[ext]) {
      vueFileContents += getElementData.call(
        this, 'style', cssLangMap[ext], filePath)
    } else if (htmlLangMap[ext]) {
      vueFileContents += getElementData.call(
        this, 'template', htmlLangMap[ext], filePath)
    }
  })

  return vueFileContents
}

var getElementData = function (tagName, lang, path) {
  this.addDependency(path)

  var attrString = ''
  if (lang) {
    attrString += ` lang="${lang}"`
  }
  if (tagName === 'style' && path.indexOf('.scoped.') > -1) {
    attrString += ' scoped'
  }

  return `\n<${tagName}${attrString}>\n` +
    fs.readFileSync(path, 'utf-8') +
    `\n</${tagName}>\n`
}
