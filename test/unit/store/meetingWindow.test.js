import { EVENTS } from 'constants';
import { createStore } from '../jest/vue-utils';
import { SETUP_FORM_OPTIONS } from '../jest/constants';

describe('meetingWindow module events tests', () => {
  const meetingWindowResponse = {
    id: 'meetingWindowId',
    name: 'test window',
    availability: {
      end_repeat: 'NEVER',
      available_times: [],
    },
  };


  test.each([
    ['submit action should send preSubmit and submit event', true],
    ['submit action should only send preSubmit if request failed', false],
  ])('%s', async (_, success) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          setup: {
            scheduleUrl: 'http://localhost:8080/MEETING_WINDOW_ID',
          },
        },
        scheduleUrl: '',
      },
      modules: {
        api: {
          actions: {
            request:
              () => (success ?
                Promise.resolve(meetingWindowResponse)
                : Promise.reject(new Error(''))),
          },
        },
      },
    });
    try {
      await store.dispatch('meetingWindow/submit', { method: 'post' });
    } catch (e) { /* silent Promise.reject threw by api/request */ }
    expect(store.messenger.send).toHaveBeenNthCalledWith(1, {
      event: EVENTS.PRE_SUBMIT_MEETING_WINDOW,
    });

    const submitEventData = {
      event: EVENTS.SUBMIT_MEETING_WINDOW,
      meetingWindow: meetingWindowResponse,
      scheduleUrl: `http://localhost:8080/${meetingWindowResponse.id}`,
    };

    if (success) {
      expect(store.messenger.send).toHaveBeenNthCalledWith(2, submitEventData);
    } else {
      expect(store.messenger.send).not.toHaveBeenNthCalledWith(
        2, submitEventData,
      );
    }
  });

  test.each([
    ['delete action should send event', true],
    ['delete action should not send event if request failed', false],
  ])('%s', async (_, success) => {
    const { store } = createStore({
      modules: {
        api: {
          actions: {
            request:
              () => (success ?
                Promise.resolve(meetingWindowResponse)
                : Promise.reject(new Error(''))),
          },
        },
      },
    });
    try {
      await store.dispatch('meetingWindow/delete');
    } catch (e) { /* silent Promise.reject threw by api/request */ }

    if (success) {
      expect(store.messenger.send).toHaveBeenNthCalledWith(1, {
        event: EVENTS.DELETE_MEETING_WINDOW,
      });
    } else {
      expect(store.messenger.send).not.toHaveBeenCalled();
    }
  });

  test.each([
    ['submit event should contain account token', true],
    ['submit event should not contain account token if loader is not in'
     + 'trusted domain', false],
  ])('%s', async (_, loaderTrusted) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          setup: {
            scheduleUrl: 'http://localhost:8080/MEETING_WINDOW_ID',
          },
        },
        scheduleUrl: '',
        loaderTrusted,
      },
      modules: {
        account: {
          initState() {
            return { account: {}, token: 'token' };
          },
        },
        api: {
          actions: {
            request: () => Promise.resolve(meetingWindowResponse),
          },
        },
      },
    });
    await store.dispatch('meetingWindow/submit', { method: 'post' });

    const submitEventData = {
      event: EVENTS.SUBMIT_MEETING_WINDOW,
      meetingWindow: meetingWindowResponse,
      scheduleUrl: `http://localhost:8080/${meetingWindowResponse.id}`,
      accountToken: loaderTrusted ? 'token' : undefined,
    };
    expect(store.messenger.send).toHaveBeenNthCalledWith(2, submitEventData);
  });
});

describe('meetingWindow module action tests', () => {
  test('setupFormOptions test', async () => {
    const { store } = createStore();
    const expected = Object.keys(SETUP_FORM_OPTIONS).reduce((result, field) => {
      result[field] = SETUP_FORM_OPTIONS[field].default;
      return result;
    }, {});
    await store.dispatch(
      'setupFormOptions',
      { formOptions: SETUP_FORM_OPTIONS, module: 'meetingWindow' },
    );
    expect(store.state.meetingWindow).toMatchObject(expected);
  });
});
