<script>
import AddAvailableTimeForm from './AddAvailableTimeForm';
import Button from './Button';
import InputField from './InputField';
import InputWrapper from './InputWrapper';
import { isRequired, isWeekdayEqual } from '../../utils/form_validator';

export default {
  name: 'AvailabilityField',
  components: {
    AddAvailableTimeForm,
    Button,
    InputField,
    InputWrapper,
  },
  data() {
    return {
      availableTimes: [...this.$props.value],
      showForm: false,
      rules: [isRequired],
    };
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    weekday: {
      type: Array,
      required: true,
    },
    startHour: {
      type: String,
      required: true,
    },
    endHour: {
      type: String,
      required: true,
    },
    weekdayOptions: {
      type: Array,
      required: true,
    },
    weekdayPresets: {
      type: Array,
      required: true,
    },
    hourOptions: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  methods: {
    hourText(start, end) {
      const { hourOptions } = this.$props;
      const startHour = hourOptions.find(h => h.value === start);
      const endHour = hourOptions.find(h => h.value === end);
      return `${startHour.text} - ${endHour.text}`;
    },
    weekdayText(weekdays) {
      const { weekdayOptions, weekdayPresets } = this.$props;
      const preset = weekdayPresets.find(
        p => isWeekdayEqual(p.weekdaySet, weekdays),
      );
      if (preset) {
        return preset.text;
      }
      const weekdayTexts = weekdays.map(
        weekday => weekdayOptions.find(o => o.value === weekday).text,
      );
      return `Every ${weekdayTexts.join(', ')}`;
    },
    addAvailableTime(availableTime) {
      this.availableTimes.push({ ...availableTime });
      /**
       * Display add availability button in next tick to ensure the validation
       * is done.
       * Otherwise, you'll see the button's color changes from error to primary
       * quickly when adding the first available time.
       */
      this.$nextTick(this.toggleForm);
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
  },
  watch: {
    availableTimes(value) {
      const { name } = this.$props;
      this.$emit('change', { name, value });
    },
  },
};

/* eslint-disable */
</script>

<style lang="less">
@import "../_variables.less";

.availability-field {
  .v-list {
    background: unset;

    .v-divider {
      opacity: 0.05;
      border-color: @accent;
    }

    .v-list__tile {
      padding-left: 0px;
      padding-top: 12px;
      padding-bottom: 4px;
      height: auto;

      .v-list__tile__title {
        opacity: 0.9;
        font-size: 16px;
        font-weight: bold;
        color: @accent;
      }

      .v-list__tile__sub-title {
        font-size: 12px;
        opacity: 0.9;
        color: @accent;
      }
    }
  }
}
</style>

<template lang="pug">
InputField(
  :label="availableTimes.length === 0 ? '': label").availability-field
  v-list.pt-0(v-show="availableTimes.length > 0")
    template(v-for="(availableTime, index) in availableTimes")
      v-divider(v-show="index > 0")
      v-list-tile
        v-list-tile-content
          v-list-tile-title
            | {{ hourText(availableTime.startHour, availableTime.endHour) }}
          v-list-tile-sub-title
            | {{ weekdayText(availableTime.weekday) }}
        v-list-tile-action
          v-btn(icon="", ripple="")
            v-icon(color="error",
                  @click.prevent="availableTimes.splice(index, 1)")
              | cancel
    v-divider(v-show="availableTimes.length > 0")
  InputWrapper(:value="availableTimes", :rules="rules", :hideDetails="showForm")
    Button(v-if="!showForm", icon="add", :btnProps="{outline: true}",
           @click="toggleForm")
      | Add Availability
    AddAvailableTimeForm(
      v-else,
      :availableTimes="availableTimes",
      :weekdayOptions="weekdayOptions", :weekdayPresets="weekdayPresets",
      :hourOptions="hourOptions", :weekday="weekday",
      :startHour="startHour", :endHour="endHour",
      @add="addAvailableTime", @cancel="toggleForm")

</template>
