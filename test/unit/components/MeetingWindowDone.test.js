import MeetingWindowDone from 'view/components/MeetingWindowDone';
import Button from 'view/components/common/Button';
import { getWrapper, createStore } from '../jest/vue-utils';

describe('Action buttons test', () => {
  test.each([
    ['No actions', [], 0],
    ['Has one action', ['close'], 1],
    ['Has two actions', ['close', 'restart'], 2],
    ['Ignore invalid actions', ['close', 'test'], 1],
  ])('%s', (_, actions, expectedNumOfButtons) => {
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
    const wrapper = getWrapper(MeetingWindowDone, {
      store,
    });
    const buttons = wrapper.findAll(Button);
    expect(buttons.length).toBe(expectedNumOfButtons);
  });
});
