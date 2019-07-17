import { notInAvailableTimes, isWeekdayEqual } from 'view/utils/form_validator';

describe('test isWeekdayEqual', () => {
  test.each([
    [
      'equal',
      new Set(['MON', 'TUE', 'WED']),
      ['TUE', 'WED', 'MON'],
      true,
    ],
    [
      'not equal',
      new Set(['MON', 'TUE']),
      ['TUE', 'WED', 'MON'],
      false,
    ],
    [
      'not equal',
      new Set(['MON', 'TUE', 'WED', 'FRI']),
      ['TUE', 'WED', 'MON'],
      false,
    ],
  ])('%s', (_, weekdaySet, weekdays, isEqual) => {
    const result = isWeekdayEqual(weekdaySet, weekdays);
    expect(result).toBe(isEqual);
  });
});

describe('test notInAvailableTimes', () => {
  const AVAILABLE_TIMES = [
    {
      startHour: '10:00:00',
      endHour: '11:00:00',
      weekday: ['MON', 'WED', 'FRI'],
    },
    {
      startHour: '11:00:00',
      endHour: '12:00:00',
      weekday: ['SAT', 'SUN'],
    },
  ];
  test.each([
    [
      'valid',
      {
        startHour: '11:00:00',
        endHour: '12:00:00',
        weekday: ['FRI', 'SAT', 'SUN'],
      },
      true,
    ],
    [
      'invalid',
      {
        startHour: '11:00:00',
        endHour: '12:00:00',
        weekday: ['SUN', 'SAT'],
      }, false,
    ],
  ])('%s', (_, availableTime, isValid) => {
    const result = notInAvailableTimes(AVAILABLE_TIMES)(availableTime);
    if (isValid) {
      expect(result).toBe(true);
    } else {
      expect(result).toEqual(expect.any(String));
    }
  });
});
