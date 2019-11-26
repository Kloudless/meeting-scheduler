<script>

import { isRequired, isWeekdayEqual } from 'view/utils/form_validator';
import InputField from './InputField';

export default {
  name: 'WeekdayPicker',
  components: {
    InputField,
  },
  data() {
    const { value } = this.$props;
    return {
      selectedWeekdays: value,
      selectedPreset: '',
    };
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    presets: {
      type: Array,
      default: () => [],
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rules() {
      const { required } = this.$props;
      return required ? [isRequired] : [];
    },
  },
  methods: {
    input() {
      // when user click on any single weekday, clear the selected preset.
      this.selectedPreset = '';
    },
    togglePreset(preset) {
      const { selectedPreset } = this;
      if (selectedPreset === preset.value) {
        this.selectedWeekdays = [];
        this.selectedPreset = '';
      } else {
        this.selectedWeekdays = [...preset.weekdaySet];
        this.selectedPreset = preset.value;
      }
    },
    reset(weekdays) {
      const { presets } = this.$props;
      const preset = presets.find(p => isWeekdayEqual(p.weekdaySet, weekdays));
      this.selectedWeekdays = weekdays;
      this.selectedPreset = preset ? preset.value : '';
    },
  },
  watch: {
    value(newValue) {
      this.reset(newValue);
    },
    selectedWeekdays(weekdays) {
      this.$emit('change', { name: this.name, value: weekdays });
    },
  },
  mounted() {
    this.reset(this.$props.value);
  },
};

/* eslint-disable */
</script>

<style lang="less">
@import "../_variables.less";

.weekday-picker {
  .v-chip {
    background-color: @primary !important;
    .v-chip__content {
      font-size: 14px;
      color: @white;
      font-weight: 700;
    }
  }
}

</style>

<template lang="pug">
InputField(:label="label").weekday-picker
  v-autocomplete(v-model="selectedWeekdays", placeholder="Select Days",
                 multiple, chips, :rules="rules", :items="options",
                 @input="input", :hide-details="hideDetails")
    template(v-slot:prepend-item="")
      template(v-for="preset in presets")
        v-list-tile(ripple, @click='togglePreset(preset)')
          v-list-tile-action
            v-icon(:color="selectedPreset === preset.value ? 'primary' : ''")
              | {{ selectedPreset === preset.value ? 'check_box' : 'check_box_outline_blank'}}
          v-list-tile-content
            v-list-tile-title {{ preset.text }}
      v-divider.mt-2

</template>
