import { EVENTS } from 'constants';
import { createStore } from '../jest/vue-utils';

describe('api module events tests', () => {
  test.each([
    ['send error event when message is set', 'Test Error Message'],
    ['do not send error event when message is unset', ''],
  ])('%s', async (_, message) => {
    const { states, store } = createStore();
    store.dispatch('api/setErrorMessage', {
      message,
    });

    expect(states.api.errorMessage).toBe(message);

    if (message) {
      expect(store.messenger.send).toHaveBeenCalledWith({
        event: EVENTS.ERROR,
        message,
      });
    } else {
      expect(store.messenger.send).toHaveBeenCalledTimes(0);
    }
  });
});
