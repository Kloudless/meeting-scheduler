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
        accountToken: 'accountToken',
      },
      expectedToHaveSubmit: true,
      expectedToHaveDelete: true,
    }],
  ])('%s', async (_, params) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          setup: params.setup,
        },
      },
      modules: {
        account: {
          initState() {
            return {
              account: 'account',
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
    store.state.meetingWindow.id = 'windowId';
    const wrapper = getWrapper(MeetingWindow, {
      store,
    });
    await wrapper.vm.$nextTick();
    const buttons = wrapper.findAll(Button);
    expect(buttons.filter(c => c.classes('action-submit')).length)
      .toBe(params.expectedToHaveSubmit ? 1 : 0);
    expect(buttons.filter(c => c.classes('action-delete')).length)
      .toBe(params.expectedToHaveDelete ? 1 : 0);
  });

  test.each([
    ['getMeetingWindow and setAccount failed, should not launch view', {
      getMeetingWindow: false, setAccount: false, shouldLaunchView: false,
    }],
    ['getMeetingWindow succeed, setAccount failed, should not launch view', {
      getMeetingWindow: true, setAccount: false, shouldLaunchView: false,
    }],
    ['getMeetingWindow failed, setAccount succeed, should not launch view', {
      getMeetingWindow: false, setAccount: true, shouldLaunchView: false,
    }],
    ['getMeetingWindow succeed, setAccount succeed, should launch view', {
      getMeetingWindow: true, setAccount: true, shouldLaunchView: true,
    }],
  ])('Edit Mode: %s', async (_, params) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          setup: {
            meetingWindowId: 'windowId',
            accountToken: 'token',
          },
        },
      },
      modules: {
        meetingWindow: {
          actions: {
            getMeetingWindow: () => (
              params.getMeetingWindow ? Promise.resolve() : Promise.reject()
            ),
          },
        },
        account: {
          actions: {
            setAccount: () => (
              params.setAccount ? Promise.resolve() : Promise.reject()
            ),
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
    await wrapper.vm.$nextTick();
    if (params.shouldLaunchView) {
      // should render TextInputs if view is expected to be launched
      expect(wrapper.findAll(TextInput).length > 0).toBe(true);
    } else {
      // should not render any TextInput if view is expected to be not launched
      expect(wrapper.findAll(TextInput).length).toBe(0);
    }
  });
});
