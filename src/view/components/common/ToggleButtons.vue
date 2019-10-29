<script>

import InputField from './InputField';
import ToggleButton from './ToggleButton';

export default {
  name: 'ToggleButtons',
  components: {
    InputField,
    ToggleButton,
  },
  data() {
    const { value } = this.$props;
    return {
      selected: value,
      type: typeof value,
    };
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick(value) {
      const { type } = this;
      this.$emit(
        'click',
        {
          name: this.name,
          value: type === 'number' ? Number.parseInt(value, 10) : value,
        },
      );
    },
  },
};

/* eslint-disable */
</script>

<style lang="scss">
@import "../_variables.scss";

.toggle-buttons {
  .v-btn-toggle {
    height: 72px;
    box-shadow: none;
    width: 100%;
  }
}

</style>

<template lang="pug">
InputField(:label="label", :tooltip="tooltip").toggle-buttons
  v-btn-toggle(v-model="selected", :mandatory="required").my-1
    template(v-for="option in options")
      ToggleButton(
        :value="option.value", :text="option.text", :caption="option.caption",
        @click="onClick($event.currentTarget.value)")

</template>
