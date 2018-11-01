/**
 * Webpack loader to remove 'import polyfills' line in auth-widget.js
 *
 * Currently, the polyfills causes production build to fail for
 * unknown reason, since the polyfill was included to support IE8,
 * it is not needed for this project and can be safely removed.
 *
 * TODO: revisit the need of this loader after upgrade to
 * webpack 4 / babel 7
 */

module.exports = function loader(source) {
  return source.replace(/\nimport '\.\/polyfills';/, '\n');
};
