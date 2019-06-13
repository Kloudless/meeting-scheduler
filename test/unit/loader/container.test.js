/* global SCHEDULER_PATH */
/* eslint-disable no-console */
import MeetingScheduler from 'loader';
import { INTERNAL_EVENTS } from 'constants';

let element;
let consoleError;
let consoleWarn;

beforeAll(() => {
  element = document.createElement('div');
  MeetingScheduler.setOptions({
    schedulerPath: 'about:blank',
  });
  // silence errors printed by config()
  consoleError = console.error;
  consoleWarn = console.warn;
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  element.remove();
  MeetingScheduler.setOptions({
    schedulerPath: SCHEDULER_PATH,
  });
  console.error = consoleError;
  console.warn = consoleWarn;
});

const viewContainerSelector = '.kloudless-meeting-scheduler';
const iframeSelector = 'iframe.kloudless-meeting-scheduler-iframe';


describe('iframe container creation and deletion tests', () => {
  // These tests have to be executed together to get correct result.

  const scheduler = new MeetingScheduler();

  let queryIframe;
  let queryIframe2;
  let viewContainer;

  test('Should not create container if options are invalid', () => {
    const valid = scheduler.config({});
    expect(valid).toBe(false);
    viewContainer = element.querySelector(viewContainerSelector);
    expect(viewContainer).toBe(null);
  });

  test('Should create iframe inside element after config() is called', () => {
    const launchOptions = {
      element,
      mode: 'attach',
      appId: 'appId',
      setup: {},
    };
    const valid = scheduler.config(launchOptions);
    expect(valid).toBe(true);

    queryIframe = element.querySelector(iframeSelector);
    expect(queryIframe instanceof HTMLElement).toBe(true);
  });

  test(
    'Should not remove existing container if config() is called again'
    + ' with invalid options', () => {
      const valid = scheduler.config({});
      expect(valid).toBe(false);

      queryIframe2 = element.querySelector(iframeSelector);
      expect(queryIframe2).toBe(queryIframe);
    },
  );

  test('Should not create a new iframe if mode is not changed', () => {
    const launchOptions = {
      element,
      mode: 'attach',
      appId: 'appId',
      schedule: {
        meetingWindowId: 'meetingWindowId',
      },
    };
    const valid = scheduler.config(launchOptions);
    expect(valid).toBe(true);

    queryIframe2 = element.querySelector(iframeSelector);
    expect(queryIframe2).toBe(queryIframe);
  });

  test('Should create a new iframe if mode is changed', () => {
    const launchOptions = {
      mode: 'modal',
      appId: 'appId',
      setup: {},
    };
    const valid = scheduler.config(launchOptions);
    expect(valid).toBe(true);

    // for modal view, the 'element' option
    // is automatically created by the scheduler
    queryIframe2 = scheduler.options.element.querySelector(iframeSelector);
    expect(queryIframe2 instanceof HTMLElement).toBe(true);
    expect(queryIframe).not.toBe(queryIframe2);
    // previous viewContainer and queryIframe should have been removed
    expect(document.body.contains(viewContainer)).toBe(false);
    expect(document.body.contains(queryIframe)).toBe(false);
  });

  test('Should destroy the iframe if destroy() is called', () => {
    scheduler.destroy();
    viewContainer = scheduler.options.element.querySelector(
      viewContainerSelector,
    );
    queryIframe = scheduler.options.element.querySelector(iframeSelector);
    expect(queryIframe).toBe(null);
    expect(viewContainer).toBe(null);
  });
});

describe('iframe show and hide tests', () => {
  let scheduler;

  beforeEach(() => {
    scheduler = new MeetingScheduler();
    scheduler.config({ appId: 'appId', setup: {} });
    // Do not send message back to iframe, won't work in jsdom environment
    scheduler.messenger.send = jest.fn();
  });

  test.each([
    [
      'Should not show iframe after config()', [], false,
    ],
    [
      'Should show iframe when launch() is called but view is not loaded',
      ['launch'],
      true,
    ],
    [
      'Should not show iframe when view is loaded but launch is not called',
      ['viewLoaded'],
      false,
    ],
    [
      'Should show iframe when calling launch(), and after view is loaded',
      ['launch', 'viewLoaded'],
      true,
    ],
    [
      'Should show iframe when view is loaded, and after calling launch()',
      ['viewLoaded', 'launch'],
      true,
    ],
  ])('%s', (_, actions, expectIframeVisible) => {
    actions.forEach((action) => {
      if (action === 'launch') {
        scheduler.launch();
      } else {
        // Assume scheduler received view loaded event from view iframe
        scheduler.onMessage({
          event: INTERNAL_EVENTS.VIEW_LOAD,
        });
      }
    });
    expect(scheduler.viewContainer.style.display).toBe(
      expectIframeVisible ? '' : 'none',
    );

    if (actions.length === 2) {
      // Should send message to launch the view
      // when view is loaded and launch() is called
      const { calls } = scheduler.messenger.send.mock;
      const eventData = calls[calls.length - 1][0];
      expect(eventData).toMatchObject({
        event: INTERNAL_EVENTS.VIEW_LAUNCH,
      });
      expect(Object.keys(eventData)).toContain('options');
    } else {
      expect(scheduler.messenger.send).not.toHaveBeenCalled();
    }
  });
});
