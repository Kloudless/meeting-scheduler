/**
 * validator functions for form input
 */

function parseValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return String(value);
}

/* eslint-disable no-param-reassign */
const validators = {
  required(value) {
    value = parseValue(value);
    if (value.length > 0) {
      return true;
    }
    return 'This field is required.';
  },
  email(value) {
    value = parseValue(value);
    if (value === '') {
      return true;
    }
    /* eslint-disable function-paren-newline */
    const index = value.search(
      /^([a-zA-Z0-9_+\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]+)$/);
    /* eslint-enable */
    if (index > -1) {
      return true;
    }
    return 'Not a valid email address';
  },
};

export default function getValidators(rules) {
  return rules.map(rule => validators[rule]);
}
