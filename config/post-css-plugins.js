const PostCssDiscardFontFace = require('postcss-discard-font-face');
const AutoPrefixer = require('autoprefixer');
const CssNano = require('cssnano');

const plugins = [
  PostCssDiscardFontFace(['woff']),
  AutoPrefixer(),
];

const cssNanoIns = CssNano();

module.exports = minimize => plugins.concat(minimize ? [cssNanoIns] : []);
