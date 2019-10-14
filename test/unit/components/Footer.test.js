import Footer from 'view/components/Footer';
import { getWrapper, createStore } from '../jest/vue-utils';

describe('Test Footer', () => {
  test.each([
    ['Should show footer image when the app does not have logo', true, false],
    ['Should hide footer image when the app has logo', false, true],
  ])('%s', async (_, appHasLogo, expectShowFooterImage) => {
    const { store } = createStore({
      state: {
        appHasLogo,
      },
    });
    const wrapper = getWrapper(Footer, {
      store,
    });
    expect(wrapper.contains('img')).toBe(expectShowFooterImage);
  });
});
