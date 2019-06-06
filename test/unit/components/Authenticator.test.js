import Authenticator from 'view/components/Authenticator';
import { EVENTS } from 'constants';
import { getWrapper, createStore } from '../jest/vue-utils';

describe('Test events', () => {
  const { store } = createStore({
    modules: {
      account: {
        actions: {
          setAccount: jest.fn(),
        },
      },
    },
  });
  const wrapper = getWrapper(Authenticator, {
    store,
  });

  test('should send error event when auth failed', () => {
    wrapper.vm.handleAuthResult({});
    const { calls } = store.messenger.send.mock;
    const eventData = calls[calls.length - 1][0];
    expect(eventData).toMatchObject({
      event: EVENTS.ERROR,
    });
    expect(Object.keys(eventData)).toContain('message');
  });

  test.each([
    ['Should send connectAccount event when account is connected', true],
    ['Should not send token if loader is not in trusted domain', false],
  ])('%s', (_, loaderTrusted) => {
    store.commit({
      type: 'setLoaderTrusted',
      trusted: loaderTrusted,
    });
    try {
      const account = {
        id: 10000,
        account: 'test@test.com',
      };
      wrapper.vm.handleAuthResult({
        account,
        access_token: 'token',
      });
      expect(store.messenger.send).toHaveBeenLastCalledWith({
        event: EVENTS.CONNECT_ACCOUNT,
        account,
        accountToken: loaderTrusted ? 'token' : undefined,
      });
    } finally {
      store.commit({
        type: 'setLoaderTrusted',
        trusted: false,
      });
    }
  });

  test('should send removeAccount event on removeAccount', () => {
    wrapper.vm.removeAccount();
    expect(store.messenger.send).toHaveBeenLastCalledWith({
      event: EVENTS.REMOVE_ACCOUNT,
    });
  });
});
