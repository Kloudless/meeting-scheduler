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
    [
      'edit mode, meetingWindow/getMeetingWindow success, ' +
      'account/setAccount success',
      {
        editMode: true,
        getMeetingWindow: true,
        setAccount: true,
        canRenderView: true,
      },
    ],
    [
      'edit mode, meetingWindow/getMeetingWindow fail, ' +
      'account/setAccount success',
      {
        editMode: true,
        getMeetingWindow: false,
        setAccount: true,
        canRenderView: false,
      },
    ],
    [
      'edit mode, meetingWindow/getMeetingWindow success, ' +
      'account/setAccount fail',
      {
        editMode: true,
        getMeetingWindow: true,
        setAccount: false,
        canRenderView: false,
      },
    ],
    [
      'create mode, account/setAccount success',
      { editMode: false, setAccount: true, canRenderView: true },
    ],
    [
      'create mode, account/setAccount fail',
      { editMode: false, setAccount: false, canRenderView: false },
    ],
  ])('test canRenderView: %s', async (_, params) => {
    const {
      editMode, setAccount, getMeetingWindow, canRenderView,
    } = params;

    // mock action functions
    const mockGetMeetingWindow = jest.fn().mockReturnValue(
      getMeetingWindow ? Promise.resolve() : Promise.reject(),
    );
    const mockSetAccount = jest.fn().mockReturnValue(
      setAccount ? Promise.resolve() : Promise.reject(),
    );

    const { store } = createStore({
      state: {
        launchOptions: {
          setup: {
            meetingWindowId: editMode ? 'fakeWindowId' : null,
            accountToken: 'token',
          },
        },
      },
      modules: {
        meetingWindow: {
          actions: {
            getMeetingWindow: mockGetMeetingWindow,
          },
        },
        account: {
          actions: {
            setAccount: mockSetAccount,
          },
        },
      },
    });

    const wrapper = getWrapper(MeetingWindow, { store });
    // initially the view should be launched with just loading screen
    expect(wrapper.findAll(TextInput).length).toBe(0);
    await wrapper.vm.$nextTick();

    expect(mockSetAccount).toHaveBeenCalledTimes(1);
    expect(mockGetMeetingWindow).toHaveBeenCalledTimes(editMode ? 1 : 0);

    if (canRenderView) {
      // should render TextInputs if view is expected to be launched
      expect(wrapper.findAll(TextInput).length > 0).toBe(true);
    } else {
      // should not render any TextInput if view is expected to be not
      // launched
      expect(wrapper.findAll(TextInput).length).toBe(0);
    }
  });
});
