import { shallowMount } from '@vue/test-utils';
import WeekdayPicker from 'view/components/common/WeekdayPicker';
import { WEEKDAYS, WEEKDAY_PRESETS } from 'view/utils/fixtures';

const PROPS = {
  name: 'weekday',
  label: 'weekday',
  value: [],
  options: WEEKDAYS,
  presets: WEEKDAY_PRESETS,
};

describe('WeekdayPicker', () => {
  test(
    'selectedWeekdays and selectedPreset should be updated while props changes',
    () => {
      const wrapper = shallowMount(WeekdayPicker, { propsData: PROPS });
      // assert init data
      expect(wrapper.vm.selectedWeekdays).toEqual([]);
      expect(wrapper.vm.selectedPreset).toBe('');

      // update props
      const { value, weekdaySet } = WEEKDAY_PRESETS[0];
      wrapper.setProps({ value: [...weekdaySet] });

      // assert data
      expect(wrapper.vm.selectedWeekdays).toEqual([...weekdaySet]);
      expect(wrapper.vm.selectedPreset).toBe(value);

      // update props
      wrapper.setProps({ value: ['SUN'] });

      // assert data
      expect(wrapper.vm.selectedWeekdays).toEqual(['SUN']);
      expect(wrapper.vm.selectedPreset).toBe('');
    },
  );
});
