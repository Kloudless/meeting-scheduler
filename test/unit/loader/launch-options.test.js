/* global SCHEDULE_URL */
import MeetingScheduler from 'loader';
import { SETUP_FORM_OPTIONS } from '../jest/constants';

let scheduler;

beforeEach(() => {
  scheduler = new MeetingScheduler();
});

/* eslint-disable no-underscore-dangle */
describe('loader._applyDefaultOptions tests', () => {
  test.each([
    ['Default mode is modal', {
      options: {},
      expected: { mode: 'modal' },
    }],
    ['Use modal if mode is invalid', {
      options: { mode: 'mode' },
      expected: { mode: 'modal' },
    }],
    ['Set default setup options', {
      options: { setup: {} },
      expected: {
        setup: {
          scheduleUrl: SCHEDULE_URL,
          afterSubmit: {
            showResult: true,
            actions: ['close'],
          },
        },
      },
    }],
    ['Set default schedule options', {
      options: { schedule: {} },
      expected: {
        schedule: {
          afterSchedule: {
            showResult: true,
            actions: ['close'],
          },
        },
      },
    }],
  ])('%s', (_, params) => {
    const result = scheduler._applyDefaultOptions(params.options);
    Object.keys(params.expected).forEach((key) => {
      expect(result[key]).toStrictEqual(params.expected[key]);
    });
  });

  test('element is auto created when mode is modal', () => {
    const result = scheduler._applyDefaultOptions({});
    const { element } = result;
    expect(element).toBeInstanceOf(HTMLElement);
  });

  test('element is selected when mode is attach', () => {
    let parentElement;
    try {
      const options = { mode: 'attach', element: '#test' };
      let expected = scheduler._applyDefaultOptions(options);
      expect(expected.element).toBe(null);

      parentElement = document.createElement('div');
      parentElement.setAttribute('id', 'test');
      document.body.appendChild(parentElement);
      expected = scheduler._applyDefaultOptions(options);
      expect(expected.element).toBeInstanceOf(HTMLElement);
    } finally {
      parentElement.remove();
    }
  });
});

describe('loader._convertOptions tests', () => {
  test.each([
    ['Convert eventUrlFormat to setup.scheduleUrl', {
      options: {
        eventUrlFormat: 'http://localhost:8080/EVENT_ID/',
      },
      expected: {
        setup: {
          scheduleUrl: 'http://localhost:8080/MEETING_WINDOW_ID/',
        },
      },
    }],
    ['Convert eventId to schedule.meetingWindowId', {
      options: { eventId: 'testMeetingWindowId' },
      expected: { schedule: { meetingWindowId: 'testMeetingWindowId' } },
    }],
  ])('%s', (_, params) => {
    scheduler._convertOptions(params.options);
    expect(params.options).toStrictEqual(params.expected);
  });
});

describe('loader._verifyOptions tests', () => {
  test.each([
    ['Must have setup or schedule', {
      options: {},
      valid: false,
    }],
    ['Cannot have both setup and schedule', {
      options: { setup: {}, schedule: {} },
      valid: false,
    }],
    ['appId is required for setup view', {
      options: { setup: {} },
      valid: false,
    }],
    ['appId and setup are presented', {
      options: { appId: 'appId', setup: {} },
      valid: true,
    }],
    ['accountToken is required for edit window', {
      options: { appId: 'appId', setup: { meetingWindowId: '1' } },
      valid: false,
    }],
    ['accountToken and meetingWindowId are presented for edit window', {
      options: {
        appId: 'appId',
        setup: {
          meetingWindowId: '1',
          accountToken: 'token',
        },
      },
      valid: true,
    }],
    ['element option is not valid', {
      options: { appId: 'appId', setup: {}, element: '#test' },
      valid: false,
    }],
    ['meetingWindowId is required for schedule view', {
      options: { schedule: {} },
      valid: false,
    }],
    ['meetingWindowId is presented in schedule options, but no appId', {
      options: { schedule: { meetingWindowId: 'meetingWindowId' } },
      valid: true,
      hasWarns: true,
    }],
    ['appId and meetingWindowId is presented for schedule view', {
      options: {
        appId: 'test',
        schedule: { meetingWindowId: 'meetingWindowId' },
      },
      valid: true,
    }],
  ])('%s', (_, params) => {
    // attach a valid element by default to prevent from copy pasting
    // document.createElement multiple times
    if (!params.options.element) {
      params.options.element = document.createElement('div');
    }
    const result = scheduler._verifyOptions(params.options);
    expect(result.valid).toBe(params.valid);
    // must contain no error message if the config is valid
    expect(result.errors.length === 0).toBe(params.valid);

    if (params.hasWarns) {
      expect(result.warns.length >= 1).toBe(true);
    }
  });
});

describe('loader._verifyFormOptions tests', () => {
  test('success', () => {
    const errors = scheduler._verifyFormOptions(SETUP_FORM_OPTIONS);
    expect(errors).toEqual([]);
  });
});
