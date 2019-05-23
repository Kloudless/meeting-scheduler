import Footer from 'view/components/Footer';
import { initStore } from 'view/store';
import router from 'view/router';
import { getWrapper } from '../jest/vue-utils';

describe('Test Footer', () => {
  const wrapper = getWrapper(Footer, {
    store: initStore(),
    router,
  });
  it('Footer image should be seen', () => {
    expect(wrapper.vm.show).toBe(true);
    expect(wrapper.contains('img')).toBe(true);
  });
});
