import MeetingWindowCompletion from 'view/components/MeetingWindowCompletion';
import Button from 'view/components/common/Button';
import { ACTIONS } from 'constants';
import { getWrapper, createStore } from '../jest/vue-utils';

describe('Action buttons test', () => {
  test.each([
    ['No actions', [], 0],
    ['Has one action', ['close'], 1],
    ['Has two actions', ['close', 'restart'], 2],
    ['Ignore invalid actions', ['close', 'test'], 1],
    ['Restart only works for create window', ['close', 'restart'],
      1, ACTIONS.UPDATE],
    ['Restart only works for create window', ['close', 'restart'],
      1, ACTIONS.DELETE],
  ])('%s', (
    _, actions, expectedNumOfButtons, action = ACTIONS.CREATE,
  ) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          setup: {
            afterSubmit: {
              actions,
            },
          },
        },
      },
    });
    const wrapper = getWrapper(MeetingWindowCompletion, {
      store,
    }, `/meetingWindowCompletion/${action}`);
    const buttons = wrapper.findAll(Button);
    expect(buttons.length).toBe(expectedNumOfButtons);
  });
});
