const PostCssDiscardFontFace = require('postcss-discard-font-face');
const AutoPrefixer = require('autoprefixer');
const CssNano = require('cssnano');

const defaultPlugins = [AutoPrefixer()];
const discardFontFaceIns = PostCssDiscardFontFace(['woff']);
const cssNanoIns = CssNano();

module.exports = (minimize, discardFonts = true) => {
  const plugins = defaultPlugins.slice();
  if (discardFonts) {
    plugins.push(discardFontFaceIns);
  }
  if (minimize) {
    plugins.push(cssNanoIns);
  }
  return plugins;
};
