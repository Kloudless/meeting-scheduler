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
      expect(wrapper.vm.$route.path).toBe('/timeSlotsCompletion/');
    } else {
      expect(store.messenger.send).toBeCalledWith({
        event: EVENTS.CLOSE,
      });
    }
  });
});

describe('if time slot start to load tests', () => {
  test.each([
    ['already has time slots, hasMore = true', true, true, 1, 0, null],
    ['already has time slots, hasMore = false', true, false, 1, 1,
      ['loaded', 'complete']],
    ['no time slots, hasMore = true', false, true, 1, 0, null],
    ['no time slots, hasMore = false', false, false, 0, 1, null],
  ])('%s', async (_, hasAvailableSlots, hasMore, loadedCalledTimes,
    completeCalledTimes, calledOrder) => {
    // arrange
    const { store } = createStore({
      modules: {
        timeSlots: {
          initState() {
            return {
              availableSlots: hasAvailableSlots ? [1] : [],
              // [1] is to make length as 1, the element isn't important.
            };
          },
          actions: {
            getTimeSlots: () => (Promise.resolve(hasMore)),
          },
        },
      },
    });

    const infiniteHandlerState = {
      complete: jest.fn(),
      loaded: jest.fn(),
    };

    // act
    const wrapper = getWrapper(TimeSlots, {
      store,
    });
    wrapper.vm.$mount();
    await wrapper.vm.infiniteHandler(infiniteHandlerState);

    // assert
    expect(infiniteHandlerState.loaded)
      .toHaveBeenCalledTimes(loadedCalledTimes);
    expect(infiniteHandlerState.complete)
      .toHaveBeenCalledTimes(completeCalledTimes);

    if (calledOrder) {
      expect(infiniteHandlerState[calledOrder[0]])
        .toHaveBeenCalledBefore(infiniteHandlerState[calledOrder[1]]);
      expect(infiniteHandlerState[calledOrder[1]])
        .toHaveBeenCalledAfter(infiniteHandlerState[calledOrder[0]]);
    }
  });
});
