import { EVENTS } from 'constants';
import { createStore } from '../jest/vue-utils';
import { SCHEDULE_FORM_OPTIONS } from '../jest/constants';

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

describe('timeSlots module action tests', () => {
  test('setupFormOptions test', async () => {
    const { store } = createStore();
    const expected = Object.keys(SCHEDULE_FORM_OPTIONS).reduce(
      (result, field) => {
        result[field] = SCHEDULE_FORM_OPTIONS[field].default;
        return result;
      }, {},
    );
    await store.dispatch(
      'setupFormOptions',
      { formOptions: SCHEDULE_FORM_OPTIONS, module: 'timeSlots' },
    );
    expect(store.state.timeSlots).toMatchObject(expected);
  });
});
