import { EVENTS } from 'constants';
import { createStore } from '../jest/vue-utils';
import iziToastHelper from '../../../src/view/utils/izitoast-helper';

describe('api module events tests', () => {
  beforeEach(() => {
    jest.spyOn(iziToastHelper, 'error').mockReturnValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each([
    ['send error event when message is set', 'Test Error Message'],
    ['do not send error event when message is unset', ''],
  ])('%s', async (_, message) => {
    const { store } = createStore();
    store.dispatch('api/setErrorMessage', {
      message,
    });

    if (message) {
      expect(store.messenger.send).toHaveBeenCalledWith({
        event: EVENTS.ERROR,
        message,
      });
      expect(iziToastHelper.error).toHaveBeenCalledWith(
        message, { detail: null },
      );
    } else {
      expect(store.messenger.send).toHaveBeenCalledTimes(0);
    }
  });
});
