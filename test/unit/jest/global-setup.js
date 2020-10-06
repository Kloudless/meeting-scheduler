const constants = require('./constants');

module.exports = async () => {
  /**
   * Mock browser time zone.
   * Note: only works in Unix env for now, see
   * https://stackoverflow.com/questions/61375425/how-do-i-set-a-timezone-in-my-jest-config-in-windows-10
   * if we need to support Windows in the future
   */
  process.env.TZ = constants.MOCK_BROWSER_TIMEZONE;
};
