/**
 * Static variables for populating UI
 * e.g. dropdown options
 */

import moment from 'moment-timezone';

const NOW = moment();
export const LOCAL_TIME_ZONE = moment.tz.guess();

export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
].map(weekday => ({
  value: weekday.slice(0, 3).toUpperCase(),
  text: weekday,
}));

export const WEEKDAY_PRESETS = [
  {
    text: 'Everyday (Monday–Sunday)',
    value: 'everyday',
    weekdaySet: new Set(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']),
  },
  {
    text: 'Weekdays (Monday–Friday)',
    value: 'weekdays',
    weekdaySet: new Set(['MON', 'TUE', 'WED', 'THU', 'FRI']),
  },
  {
    text: 'Weekends (Saturday–Sunday)',
    value: 'weekends',
    weekdaySet: new Set(['SAT', 'SUN']),
  },
];

export const TIME_SLOT_INTERVALS = [
  { value: 15, text: '15 mins', caption: '(0.25 hour)' },
  { value: 30, text: '30 mins', caption: '(0.5 hour)' },
  { value: 45, text: '45 mins', caption: '(0.75 hour)' },
  { value: 60, text: '60 mins', caption: '(1 hour)' },
];

export const DURATIONS = [
  { value: 15, text: '15 mins', caption: '(0.25 hour)' },
  { value: 30, text: '30 mins', caption: '(0.5 hour)' },
  { value: 60, text: '60 mins', caption: '(1 hour)' },
];

export const HOURS = [
  { text: '0:00 AM', value: '00:00:00' },
  { text: '1:00 AM', value: '01:00:00' },
  { text: '2:00 AM', value: '02:00:00' },
  { text: '3:00 AM', value: '03:00:00' },
  { text: '4:00 AM', value: '04:00:00' },
  { text: '5:00 AM', value: '05:00:00' },
  { text: '6:00 AM', value: '06:00:00' },
  { text: '7:00 AM', value: '07:00:00' },
  { text: '8:00 AM', value: '08:00:00' },
  { text: '9:00 AM', value: '09:00:00' },
  { text: '10:00 AM', value: '10:00:00' },
  { text: '11:00 AM', value: '11:00:00' },
  { text: '12:00 PM', value: '12:00:00' },
  { text: '1:00 PM', value: '13:00:00' },
  { text: '2:00 PM', value: '14:00:00' },
  { text: '3:00 PM', value: '15:00:00' },
  { text: '4:00 PM', value: '16:00:00' },
  { text: '5:00 PM', value: '17:00:00' },
  { text: '6:00 PM', value: '18:00:00' },
  { text: '7:00 PM', value: '19:00:00' },
  { text: '8:00 PM', value: '20:00:00' },
  { text: '9:00 PM', value: '21:00:00' },
  { text: '10:00 PM', value: '22:00:00' },
  { text: '11:00 PM', value: '23:00:00' },
  { text: '00:00 AM', value: '24:00:00' },
];

export const createTimeZoneDropdownItem = (tz, suffix) => ({
  text: `(GMT${NOW.tz(tz).format('Z')}) ${tz.replace(/_/g, ' ')}`,
  value: tz,
  suffix,
});

export const TIME_ZONES = moment.tz.names().map(
  tz => createTimeZoneDropdownItem(tz),
);

/**
 * Return the default display timeZone for Schedule View based on launchOptions
 * and Meeting Window's timeZone.
 *
 * @param {*} launchOptions - Schedule View launch options.
 * @param {*} meetingWindow - The meeting window object.
 */
export function getDefaultTimeZone(launchOptions, meetingWindow) {
  let result = launchOptions.timeZone;
  if (result === 'organizer' && meetingWindow.timeZone) {
    result = meetingWindow.timeZone;
  }
  // Fallback to browser's timeZone if it's not valid, includes 'organizer'
  // and 'local'.
  if (!result || !TIME_ZONES.find(e => e.value === result)) {
    result = LOCAL_TIME_ZONE;
  }
  return result;
}
