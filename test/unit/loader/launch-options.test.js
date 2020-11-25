/* global SCHEDULE_URL */
import MeetingScheduler from 'loader';
import { SETUP_FORM_OPTIONS, SCHEDULE_FORM_OPTIONS } from '../jest/constants';

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
          authOptions: {
            scope: 'calendar:normal',
          },
        },
      },
    }],
    ['Set default schedule options', {
      options: { schedule: {} },
      expected: {
        schedule: {
          rescheduleUrl: RESCHEDULE_URL,
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

  describe('setup.formOptions transformations for non-editable fields', () => {
    test.each([
      [
        'should convert defaultEventMetadata to internal format',
        {
          formOptions: { defaultEventMetadata: { transparent: true } },
          expected: {
            defaultEventMetadata: { default: { transparent: true } },
          },
        },
      ],
      [
        'should convert allowEventMetadata to internal format',
        {
          formOptions: { allowEventMetadata: true },
          expected: { allowEventMetadata: { default: true } },
        },
      ],
      [
        'should not convert allowEventMetadata again when old option format'
        + ' is used',
        {
          formOptions: { allowEventMetadata: { default: true } },
          expected: { allowEventMetadata: { default: true } },
        },
      ],
      [
        'should avoid processing allowEventMetadata if it is null',
        {
          formOptions: { allowEventMetadata: null },
          expected: { allowEventMetadata: null },
        },
      ],
      [
        'should avoid accessing fromOptions if it is null',
        {
          formOptions: null,
          expected: null,
        },
      ],
    ])('%s', (_, testOptions) => {
      const { formOptions, expected } = testOptions;
      const result = scheduler._applyDefaultOptions({ setup: { formOptions } });
      if (expected !== null) {
        expect(result.setup.formOptions).toMatchObject(expected);
      } else {
        expect(result.setup.formOptions).toBeNull();
      }
    });
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
    ['customStyleVars is not object', {
      options: { appId: 'appId', customStyleVars: 1, setup: {} },
      valid: false,
    }],
    ['customStyleVars is null', {
      options: { appId: 'appId', customStyleVars: null, setup: {} },
      valid: false,
    }],
    ['customStyleVars is object', {
      options: { appId: 'appId', customStyleVars: {}, setup: {} },
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

describe('loader._verifySetupFormOptions negative tests', () => {
  test.each([
    ['title.default is required if title.visible is false',
      { title: { visible: false, default: '' } }, 'token'],
    ['organizer.default is required if organizer.visible is false',
      { organizer: { visible: false } }, 'token'],
    [
      'bookingCalendarId.default is required if bookingCalendarId.visible is' +
      'false',
      { bookingCalendarId: { visible: false } }, 'token'],
    ['bookingCalendarId',
      { bookingCalendarId: { visible: false, default: 'primary' } }, null],
  ])('%s', (_, formOptions, accountToken) => {
    const errors = scheduler._verifySetupFormOptions(formOptions, accountToken);
    expect(errors).toHaveLength(1);
  });
});

describe('loader._verifyScheduleFormOptions negative tests', () => {
  test.each([
    ['name.default is required if name.visible is false',
      { name: { visible: false, default: '' } }],
    ['email.default is required if email.visible is false',
      { email: { visible: false } }],
  ])('%s', (_, formOptions) => {
    const errors = scheduler._verifyScheduleFormOptions(formOptions);
    expect(errors).toHaveLength(1);
  });
});

describe('loader._verifySetupFormOptions tests', () => {
  test('success', () => {
    const fakeAccountToken = 'token';
    const errors = scheduler._verifySetupFormOptions(
      SETUP_FORM_OPTIONS, fakeAccountToken,
    );
    expect(errors).toEqual([]);
  });
});

describe('loader._verifyScheduleFormOptions tests', () => {
  test('success', () => {
    const errors = scheduler._verifyScheduleFormOptions(SCHEDULE_FORM_OPTIONS);
    expect(errors).toEqual([]);
  });
});
