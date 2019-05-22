/**
 * Export common variables used by webpack, babel, and jest configs
 */

// list all bundled modules that needs to be transpiled by babel
const bundledModules = [
  '@kloudless/authenticator',
  'vuetify',
];

module.exports = {
  /**
   * A list of paths in regexp format to specify which files / folders
   * babel should ignore.
   *
   * This list is used by
   * 1. 'ignore' option in babel.config.js
   * 2. 'transformIgnorePatterns' option in jest.conf.js
   */
  ignorePaths: [
    new RegExp(`node_modules/(?!(${bundledModules.join('|')}))`),
  ],
  /**
   * A list of paths to resolve module imports
   *
   * This list is used by
   * 1. 'module-resolver' plugin's root option in babel.config.js
   * 2. webpack's resolve.modules option
   */
  resolvePaths: ['src', 'node_modules'],
};
