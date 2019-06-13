/* eslint-disable no-console, no-underscore-dangle */
import MeetingScheduler from 'loader';

let scheduler;
let consoleError;
let consoleWarn;

beforeAll(() => {
  // silence errors printed by config()
  consoleError = console.error;
  consoleWarn = console.warn;
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = consoleError;
  console.warn = consoleWarn;
});

beforeEach(() => {
  scheduler = new MeetingScheduler();
  scheduler._launchView = jest.fn();
});

describe('loader.launch() tests', () => {
  test.each([
    [
      'Should not launch if called without pre-configure',
      { launchOptions: undefined, expectLaunch: false },
    ],
    [
      'Should not launch if called with invalid options',
      { launchOptions: {}, expectLaunch: false },
    ],
    [
      'Launch the view if called with valid options',
      { launchOptions: { appId: 'appId', setup: {} }, expectLaunch: true },
    ],
    [
      'Should not launch if config() is called prior with invalid options',
      { callConfig: true, launchOptions: {}, expectLaunch: false },
    ],
    [
      'Launch the view if config() is called prior with valid options',
      {
        callConfig: true,
        launchOptions: { appId: 'appId', setup: {} },
        expectLaunch: true,
      },
    ],
  ])('%s', (_, options) => {
    if (options.callConfig) {
      scheduler.config(options.launchOptions);
      scheduler.launch();
    } else {
      scheduler.launch(options.launchOptions);
    }
    if (options.expectLaunch) {
      expect(scheduler._launchView).toBeCalled();
    } else {
      expect(scheduler._launchView).not.toBeCalled();
    }
  });

  test('Should re-configure even if config() is called prior', () => {
    scheduler.config({ appId: 'appId', setup: {} });

    const newOption
     = { appId: 'appId', setup: { accountToken: 'accountToken ' } };
    scheduler.launch(newOption);
    expect(scheduler.options).toMatchObject(newOption);
  });
});
