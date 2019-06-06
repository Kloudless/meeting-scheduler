import MeetingWindow from 'view/components/MeetingWindowDeletion';
import { SUBMIT_STATUS, EVENTS } from 'constants';
import { getWrapper, createStore } from '../jest/vue-utils';

describe('afterSubmit config tests', () => {
  test.each([
    ['Show result after submit', true],
    ['Destroy the view after submit', false],
  ])('%s', (_, showResult) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          setup: {
            afterSubmit: {
              showResult,
            },
          },
        },
      },
    });
    const wrapper = getWrapper(MeetingWindow, {
      store,
    });
    wrapper.vm.afterSubmit();
    if (showResult) {
      expect(wrapper.vm.$route.path).toBe(
        `/meetingWindowCompletion/${SUBMIT_STATUS.DELETED}`,
      );
    } else {
      expect(store.messenger.send).toBeCalledWith({
        event: EVENTS.CLOSE,
      });
    }
  });
});
