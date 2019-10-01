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

describe('getAppConfig should always set flag and be resolved', () => {
  test.each([
    ['appId is not provided', { appId: null, expectLoaderTrusted: false }],
    ['No service response', { appId: 'appId', expectLoaderTrusted: false }],
    ['Loader is not trusted', {
      appId: 'appId', hasResponse: true, expectLoaderTrusted: false,
    }],
    ['Loader is trusted', {
      appId: 'appId', hasResponse: true, expectLoaderTrusted: true,
    }],
    ['Custom logo is not set for this app', {
      appId: 'appId', hasResponse: true, expectHasLogo: false,
    }],
    ['Custom logo is set for this app', {
      appId: 'appId', hasResponse: true, expectHasLogo: true,
    }],
  ])('%s', async (_, params) => {
    const { store } = createStore({
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
                  user_data: {
                    logo_url: params.expectHasLogo ? 'data:foo' : undefined,
                    trusted: params.expectLoaderTrusted,
                  },
                }) : Promise.reject())),
          },
        },
      },
    });
    const promise = store.dispatch('getAppConfig');
    await promise;
    expect(promise).resolves.toEqual(undefined);
    if (typeof params.expectLoaderTrusted !== 'undefined') {
      expect(store.state.loaderTrusted).toBe(params.expectLoaderTrusted);
    } else {
      expect(store.state.appHasLogo).toBe(params.expectHasLogo);
    }
  });
});

describe('initialize action tests', () => {
  /**
   * These tests have to be executed together to get correct result.
   */
  const getAppConfig = jest.fn();
  const { states, store } = createStore({
    state: {
      launchOptions: {},
      loaderTrusted: false,
    },
    actions: {
      getAppConfig,
    },
  });

  const launchOptions = {
    appId: 'appId',
    setup: {},
  };

  test('Should dispatch getAppConfig',
    async () => {
      await store.dispatch('initialize', { launchOptions });
      expect(getAppConfig).toHaveBeenCalledTimes(1);
    });

  test('Should not dispatch getAppConfig with the same appId',
    async () => {
      await store.dispatch('initialize', { launchOptions });
      expect(getAppConfig).toHaveBeenCalledTimes(1);
    });

  test('Should dispatch getAppConfig again if appId is changed',
    async () => {
      launchOptions.appId = 'appId2';
      await store.dispatch('initialize', { launchOptions });
      expect(getAppConfig).toHaveBeenCalledTimes(2);
    });

  test('Should reset account if accountToken is changed',
    async () => {
      states.account.token = 'accountToken';
      launchOptions.setup.accountToken = 'accountToken2';
      await store.dispatch('initialize', { launchOptions });
      expect(states.account.token).toBe(null);
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
        availability: {
          available_times: [{
            start: '',
            end: '',
            recurring: { weekday: '' },
          }],
        },
      },
    });
    store.commit({
      type: 'setScheduleUrl',
    });
    expect(states.root.scheduleUrl)
      .toBe('http://localhost:8080/meetingWindowId/');
  });
});
