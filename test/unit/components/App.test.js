import App from 'view/components/App';
import { EVENTS } from 'constants';
import { getWrapper, createStore } from '../jest/vue-utils';

describe('Test events', () => {
  const { store } = createStore({
    state: {
      launchOptions: {
        setup: {},
      },
    },
  });
  const wrapper = getWrapper(App, {
    store,
  });

  test('should send open event on mounted', () => {
    expect(store.messenger.send).toHaveBeenLastCalledWith({
      event: EVENTS.OPEN,
    });
  });

  test('should send close event when close button is clicked', () => {
    wrapper.vm.closeDialog();
    expect(store.messenger.send).toHaveBeenLastCalledWith({
      event: EVENTS.CLOSE,
    });
  });
});
