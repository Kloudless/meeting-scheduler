import MeetingWindow from 'view/components/MeetingWindow';
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
      expect(wrapper.vm.$route.path).toBe('/meetingWindowDone/');
    } else {
      expect(store.messenger.send).toBeCalledWith({
        event: 'close',
      });
    }
  });
});
