import MeetingWindowCompletion from 'view/components/MeetingWindowCompletion';
import Button from 'view/components/common/Button';
import { getWrapper, createStore } from '../jest/vue-utils';
import { SUBMIT_STATUS } from 'constants';

describe('Action buttons test', () => {
  test.each([
    ['No actions', [], 0],
    ['Has one action', ['close'], 1],
    ['Has two actions', ['close', 'restart'], 2],
    ['Ignore invalid actions', ['close', 'test'], 1],
    ['Restart only works for create window', ['close', 'restart'],
      1, SUBMIT_STATUS.UPDATED],
    ['Restart only works for create window', ['close', 'restart'],
      1, SUBMIT_STATUS.DELETED],
  ])('%s', (
    _, actions, expectedNumOfButtons, submitStatus = SUBMIT_STATUS.CREATED,
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
    }, `/meetingWindowCompletion/${submitStatus}/`);
    const buttons = wrapper.findAll(Button);
    expect(buttons.length).toBe(expectedNumOfButtons);
  });
});
