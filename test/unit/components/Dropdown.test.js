import { shallowMount } from '@vue/test-utils';
import Dropdown from 'view/components/common/Dropdown';
import { HOURS, WEEKDAYS } from 'view/utils/fixtures';

const PROPS = {
  name: 'dropdown',
  label: 'dropdown',
  options: HOURS,
  value: HOURS[1].value,
};

describe('Dropdown', () => {
  test.each([
    ['test init data', {}, HOURS[1].value],
    [
      'selected should be the first option if value not match any.',
      { value: '' },
      HOURS[0].value,
    ],
    [
      'test selected if value changed',
      { value: HOURS[2].value },
      HOURS[2].value,
    ],
    [
      'test selected if options changed',
      { options: WEEKDAYS },
      WEEKDAYS[0].value,
    ],
  ])('%s', (_, props, expected) => {
    const wrapper = shallowMount(Dropdown, { propsData: PROPS });
    // update props
    wrapper.setProps(props);
    // assert
    expect(wrapper.vm.selected).toBe(expected);
  });
});
