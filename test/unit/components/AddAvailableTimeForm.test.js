import { shallowMount } from '@vue/test-utils';
import AddAvailableTimeForm from 'view/components/common/AddAvailableTimeForm';
import { HOURS, WEEKDAYS, WEEKDAY_PRESETS } from 'view/utils/fixtures';

const PROPS = {
  weekday: [],
  startHour: HOURS[0].value,
  endHour: HOURS[1].value,
  weekdayOptions: WEEKDAYS,
  hourOptions: HOURS,
  weekdayPresets: WEEKDAY_PRESETS,
  availableTimes: [],
};

describe('AddAvailableTimeForm', () => {
  describe('test add method', () => {
    test.each([
      [
        'Should emit add event if form is valid.',
        true,
        true,
      ],
      [
        "Shouldn't emit add event if form is invalid.",
        false,
        false,
      ],
    ])('%s', (_, isValid, shouldEmitAddEvent) => {
      const wrapper = shallowMount(AddAvailableTimeForm, { propsData: PROPS });

      // mock method
      wrapper.vm.$refs.form.validate = jest.fn(() => isValid);

      // call add
      wrapper.vm.add();

      // assert
      if (shouldEmitAddEvent) {
        expect(wrapper.emitted('add').length).toBe(1);
        expect(wrapper.emitted('add')[0]).toEqual([wrapper.vm.availableTime]);
      } else {
        expect(wrapper.emitted('add')).toBeFalsy();
      }
    });
  });

  test('test startHourOptions, endHourOptions', () => {
    const wrapper = shallowMount(AddAvailableTimeForm, { propsData: PROPS });

    // assert init data
    expect(wrapper.vm.startHourOptions).toEqual(HOURS.slice(0, 1));
    expect(wrapper.vm.endHourOptions).toEqual(HOURS.slice(1));

    // update endHour
    expect(wrapper.setData({
      availableTime: {
        ...wrapper.vm.availableTime,
        endHour: HOURS[10].value,
      },
    }));

    // assert data
    expect(wrapper.vm.startHourOptions).toEqual(HOURS.slice(0, 10));
    expect(wrapper.vm.endHourOptions).toEqual(HOURS.slice(1));

    // update startHour
    expect(wrapper.setData({
      availableTime: {
        ...wrapper.vm.availableTime,
        startHour: HOURS[5].value,
      },
    }));

    // assert data
    expect(wrapper.vm.startHourOptions).toEqual(HOURS.slice(0, 10));
    expect(wrapper.vm.endHourOptions).toEqual(HOURS.slice(6));
  });
});
