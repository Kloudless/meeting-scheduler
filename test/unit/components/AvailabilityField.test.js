import { shallowMount } from '@vue/test-utils';
import AvailabilityField from 'view/components/common/AvailabilityField';
import { HOURS, WEEKDAYS, WEEKDAY_PRESETS } from 'view/utils/fixtures';


const PROPS = {
  label: 'AvailabilityField',
  name: 'AvailabilityField',
  weekday: [],
  startHour: HOURS[0].value,
  endHour: HOURS[1].value,
  weekdayOptions: WEEKDAYS,
  weekdayPresets: WEEKDAY_PRESETS,
  hourOptions: HOURS,
  value: [
    { startHour: '11:00:00', endHour: '12:00:00', weekday: ['SUN'] },
  ],
};

describe('AvailabilityField', () => {
  describe('test weekdayText method', () => {
    test.each([
      [
        "Should return preset's text if match preset weekdays (ignore order).",
        Array.from(WEEKDAY_PRESETS[0].weekdaySet).reverse(),
        WEEKDAY_PRESETS[0].text,
      ],
      [
        "Should return weekdays' texts.",
        ['MON', 'TUE'],
        'Every Monday, Tuesday',
      ],
    ])('%s', (_, weekdays, expected) => {
      const wrapper = shallowMount(AvailabilityField, { propsData: PROPS });
      // call addAvailableTime
      const result = wrapper.vm.weekdayText(weekdays);
      // assert
      expect(result).toEqual(expected);
    });
  });

  test('test addAvailableTime method', () => {
    const newAvailableTime = {
      startHour: '11:00:00', endHour: '12:00:00', weekday: ['MON'],
    };
    const wrapper = shallowMount(AvailabilityField, { propsData: PROPS });
    // call addAvailableTime
    wrapper.vm.addAvailableTime(newAvailableTime);
    // assert
    expect(wrapper.vm.availableTimes).toEqual(
      [...PROPS.value, newAvailableTime],
    );
  });
});
