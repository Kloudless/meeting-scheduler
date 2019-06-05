import TimeSlots from 'view/components/TimeSlots';
import { EVENTS } from 'constants';
import { getWrapper, createStore } from '../jest/vue-utils';

// disable making API requests when mounting TimeSlots view
TimeSlots.mounted = jest.fn();

describe('afterSchedule config tests', () => {
  test.each([
    ['Show result after submit', true],
    ['Destroy the view after submit', false],
  ])('%s', (_, showResult) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          schedule: {
            afterSchedule: {
              showResult,
            },
          },
        },
      },
    });
    const wrapper = getWrapper(TimeSlots, {
      store,
    });
    wrapper.vm.afterSubmit();
    if (showResult) {
      expect(wrapper.vm.$route.path).toBe('/timeSlotsDone/');
    } else {
      expect(store.messenger.send).toBeCalledWith({
        event: EVENTS.CLOSE,
      });
    }
  });
});
