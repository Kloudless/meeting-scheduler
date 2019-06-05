import { EVENTS } from 'constants';
import { createStore } from '../jest/vue-utils';

describe('meetingWindow module events tests', () => {
  const meetingWindowResponse = {
    id: 'testId', name: 'test window',
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
      await store.dispatch('meetingWindow/submit');
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
});
