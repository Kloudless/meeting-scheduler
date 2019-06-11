import { EVENTS } from 'constants';
import { createStore } from '../jest/vue-utils';

describe('timeSlots module events tests', () => {
  const scheduleResponse = {
    id: 'testId',
  };
  test.each([
    ['submit action should send preSchedule and schedule event', true],
    ['submit action should only send preSchedule if request failed', false],
  ])('%s', async (_, success) => {
    const { store } = createStore({
      modules: {
        timeSlots: {
          initState() {
            return {
              selectedSlot: {
                start: '2018-01-01T00:00:00+00:00',
                end: '2018-01-01T00:30:00+00:00',
              },
            };
          },
        },
        api: {
          actions: {
            request:
              () => (success ?
                Promise.resolve(scheduleResponse)
                : Promise.reject(new Error(''))),
          },
        },
      },
    });
    try {
      await store.dispatch('timeSlots/submit', { recaptchaToken: '' });
    } catch (e) { /* silent Promise.reject threw by api/request */ }
    expect(store.messenger.send).toHaveBeenNthCalledWith(1, {
      event: EVENTS.PRE_SCHEDULE,
    });

    const submitEventData = {
      event: EVENTS.SCHEDULE,
      scheduledEvent: scheduleResponse,
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
