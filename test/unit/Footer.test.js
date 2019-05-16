import Footer from 'view/components/Footer';
import store from 'view/store';
import router from 'view/router';
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
