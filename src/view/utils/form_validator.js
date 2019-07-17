/**
 * validator functions for form input
 */

/**
  * Return true if value is following:
  * - undefined
  * - null
  * - empty string
  * - empty array
  * @param {*} value
  */
function isEmpty(value) {
  if (value === undefined || value === null) {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  return false;
}

function isRequired(value) {
  return !isEmpty(value) || 'This field is is required.';
}

const PATTERN_EMAIL = /^([a-zA-Z0-9_+\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]+)$/;
function isEmail(value) {
  if (isEmpty(value)) {
    return true;
  }
  if (PATTERN_EMAIL.test(value)) {
    return true;
  }
  return 'Not a valid email address.';
}

function inRangeOf(min, max) {
  return (value) => {
    if (isEmpty(value)) {
      return true;
    }
    if (value >= min && value <= max) {
      return true;
    }
    return `Should be in range of ${min}–${max}.`;
  };
}

/**
 * Check if weekday set is equal to weekdays (order is ignored)
 * @param {Set} weekdaySet
 * @param {Array} weekdays
 */
function isWeekdayEqual(weekdaySet, weekdays) {
  return (
    weekdaySet.size === weekdays.length
    && weekdays.every(weekday => weekdaySet.has(weekday))
  );
}

function notInAvailableTimes(availableTimes) {
  return (newAvailableTime) => {
    const isIn = availableTimes.some(a => (
      a.startHour === newAvailableTime.startHour
    && a.endHour === newAvailableTime.endHour
    && isWeekdayEqual(new Set(a.weekday), newAvailableTime.weekday)
    ));
    if (isIn) {
      return `
        The specified available days and hours have been added.<br/>
        Please choose a different days / hours.`;
    }
    return true;
  };
}

export {
  isRequired,
  isEmail,
  inRangeOf,
  isWeekdayEqual,
  notInAvailableTimes,
};
