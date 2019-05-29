import { createStore } from '../jest/vue-utils';

describe('Event dispatch tests', () => {
  test('should call messenger.send when dispatching event', () => {
    const { store } = createStore();
    store.dispatch('event', {
      event: 'event', data: 'data',
    });
    expect(store.messenger.send).toHaveBeenCalled();
  });

  test.each([
    ['Should send confidential data if loader domain is trusted', true],
    [
      'Should not send confidential data is loader domain is not trusted',
      false,
    ],
  ])('%s', (_, loaderTrusted) => {
    const eventData = {
      event: 'event',
      data: 'data',
      confidentialData: {
        confidential: 'confidential',
      },
    };
    const { store } = createStore({
      state: {
        loaderTrusted,
      },
    });
    store.dispatch('event', eventData);
    const { calls } = store.messenger.send.mock;
    const message = calls[calls.length - 1][0];
    expect(message).toMatchObject({
      event: 'event',
      data: 'data',
    });
    if (loaderTrusted) {
      expect(message.confidential).toBe('confidential');
    } else {
      expect(message.confidential).not.toBeDefined();
    }
  });
});

describe('checkLoaderTrusted should always set flag and be resolved', () => {
  test.each([
    ['appId is not provided', { appId: null, expectLoaderTrusted: false }],
    ['No service response', { appId: 'appId', expectLoaderTrusted: false }],
    ['Loader is not trusted', {
      appId: 'appId', hasResponse: true, expectLoaderTrusted: false,
    }],
    ['Loader is trusted', {
      appId: 'appId', hasResponse: true, expectLoaderTrusted: true,
    }],
  ])('%s', (_, params) => {
    const { states, store } = createStore({
      state: {
        launchOptions: {
          appId: params.appId,
        },
      },
      modules: {
        api: {
          actions: {
            request: jest.fn(() => (
              params.hasResponse ?
                Promise.resolve({
                  user_data: { trusted: params.expectLoaderTrusted },
                }) : Promise.reject())),
          },
        },
      },
    });
    const promise = store.dispatch('checkLoaderTrusted');
    expect(promise).resolves.toEqual(undefined);
    promise.then(() => {
      expect(states.root.loaderTrusted).toBe(params.expectLoaderTrusted);
    });
  });
});

describe('Others', () => {
  test('test generate schedule Url', () => {
    const { states, store } = createStore({
      state: {
        launchOptions: {
          setup: {
            scheduleUrl: 'http://localhost:8080/MEETING_WINDOW_ID/',
          },
        },
      },
    });

    store.commit({
      type: 'meetingWindow/setMeetingWindow',
      meetingWindow: {
        id: 'meetingWindowId',
        name: 'test window',
        availability: [{
          start: '',
          end: '',
          recurring: {},
        }],
      },
    });
    store.commit({
      type: 'setScheduleUrl',
    });
    expect(states.root.scheduleUrl)
      .toBe('http://localhost:8080/meetingWindowId/');
  });
});
