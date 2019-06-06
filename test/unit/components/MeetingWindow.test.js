import MeetingWindow from 'view/components/MeetingWindow';
import Button from 'view/components/common/Button';
import TextInput from 'view/components/common/TextInput';
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
        `/meetingWindowCompletion/${SUBMIT_STATUS.CREATED}`,
      );
    } else {
      expect(store.messenger.send).toBeCalledWith({
        event: EVENTS.CLOSE,
      });
    }
  });
});

describe('Mode check test', () => {
  test.each([
    ['Create mode should not show delete button', {
      setup: {},
      expectedToHaveSubmit: true,
      expectedToHaveDelete: false,
    }],
    ['Edit mode should show delete button', {
      setup: {
        meetingWindowId: 'windowId',
      },
      expectedToHaveSubmit: true,
      expectedToHaveDelete: true,
    }],
  ])('%s', (_, params) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          setup: params.setup,
        },
      },
      modules: {
        meetingWindow: {
          initState() {
            return {
              id: 'windowId',
            };
          },
        },
        api: {
          actions: {
            request: () => (Promise.resolve('')),
          },
        },
      },
    });
    const wrapper = getWrapper(MeetingWindow, {
      store,
    });
    const buttons = wrapper.findAll(Button);
    expect(buttons.filter(c => c.classes('action-submit')).length)
      .toBe(params.expectedToHaveSubmit ? 1 : 0);
    expect(buttons.filter(c => c.classes('action-delete')).length)
      .toBe(params.expectedToHaveDelete ? 1 : 0);
  });

  test('Should not render the view until getting data for edit mode',
    async () => {
      const promise = new Promise((resolve) => {
        // do not resolve immediately so that we can test the view
        // before / after calling getMeetingWindow action
        setTimeout(resolve, 1);
      });

      // replace API request with mock promise
      const getMeetingWindow = jest.fn(() => promise);

      const { store } = createStore({
        state: {
          launchOptions: {
            setup: {
              meetingWindowId: 'windowId',
            },
          },
        },
        modules: {
          meetingWindow: {
            actions: {
              getMeetingWindow,
            },
          },
          api: {
            actions: {
              request: () => (Promise.resolve('')),
            },
          },
        },
      });
      const wrapper = getWrapper(MeetingWindow, {
        store,
      });
      // initially the view should be launched with just loading screen
      expect(wrapper.findAll(TextInput).length).toBe(0);
      await promise;
      expect(wrapper.findAll(TextInput).length > 0).toBe(true);
    });
});
