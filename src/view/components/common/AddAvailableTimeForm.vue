<script>

import InputLabel from './InputLabel';
import WeekdayPicker from './WeekdayPicker';
import Dropdown from './Dropdown';
import Button from './Button';
import { notInAvailableTimes } from '../../utils/form_validator';

export default {
  name: 'AddAvailableTimeForm',
  components: {
    InputLabel,
    WeekdayPicker,
    Dropdown,
    Button,
  },
  data() {
    const { weekday, startHour, endHour } = this.$props;
    return {
      availableTime: {
        weekday,
        startHour,
        endHour,
      },
      isFormValid: false,
    };
  },
  props: {
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
    hourOptions: {
      type: Array,
      required: true,
    },
    weekdayPresets: {
      type: Array,
      required: true,
    },
    availableTimes: {
      type: Array,
      required: true,
    },
  },
  watch: {
    availableTimes() {
      this.$refs.form.validate();
    },
  },
  computed: {
    startHourOptions() {
      const { hourOptions } = this.$props;
      const { availableTime: { endHour } } = this;
      const index = hourOptions.findIndex(h => h.value === endHour);
      return hourOptions.slice(0, index);
    },
    endHourOptions() {
      const { hourOptions } = this.$props;
      const { availableTime: { startHour } } = this;
      const index = hourOptions.findIndex(h => h.value === startHour);
      return hourOptions.slice(index + 1);
    },
    rules() {
      const { availableTimes } = this.$props;
      return [notInAvailableTimes(availableTimes)];
    },
  },
  methods: {
    update({ name, value }) {
      this.availableTime[name] = value;
      this.$refs.form.validate();
    },
    add() {
      if (this.$refs.form.validate()) {
        this.$emit('add', this.availableTime);
        // reset value
        const { weekday, startHour, endHour } = this.$props;
        this.availableTime = { weekday, startHour, endHour };
      }
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
v-form.add-available-time-form(ref="form", v-model="isFormValid",
                               lazy-validation)
  v-input(:rules="rules", :value="availableTime")
    v-container(grid-list-xs).pt-2.pb-2
      WeekdayPicker(
        required, label='Available Days', name="weekday", :hideDetails="true",
        :options="weekdayOptions", :value="availableTime.weekday",
        :presets="weekdayPresets", @change="update")
      InputLabel Available Hours
      v-layout(row, wrap, align-center)
        v-flex(xs4)
          Dropdown(
            required, label="", name="startHour", :hideDetails="true",
            :options="startHourOptions", :value="availableTime.startHour",
            @update="update")
        v-flex(xs3)
          div.hour-to.on-secondary--text TO
        v-flex(xs4)
          Dropdown(
            required, label="", name="endHour", :hideDetails="true",
            :options="endHourOptions", :value="availableTime.endHour",
            @update="update")
      v-layout(justify-center, row)
        Button(:btnProps="{outline: true}", :disabled="!isFormValid", @click="add")
          | Add
        Button(:btnProps="{outline: true}", color="error", @click="$emit('cancel')")
          | Cancel

</template>
