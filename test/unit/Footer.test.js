import Footer from 'components/Footer';
import store from 'store';
import router from 'router';
import { getWrapper } from './helpers.js';

describe('Test Footer', () => {
  const wrapper = getWrapper(Footer, {
    store,
    router,
  });
  it('Footer image should be seen', () => {
    expect(wrapper.vm.show).toBe(true);
    expect(wrapper.contains('img')).toBe(true);
  });
});
