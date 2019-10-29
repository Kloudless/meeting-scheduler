<script>
import InputField from '../InputField';
import { inRangeOf, isRequired } from '../../../utils/form_validator';

export default {
  name: 'NumberField',
  components: {
    InputField,
  },
  data() {
    return {
      selected: this.$props.value,
    };
  },
  computed: {
    rules() {
      const { required } = this.$props;
      const { min, max } = this;
      const rules = [inRangeOf(min, max)];
      if (required) {
        rules.push(isRequired);
      }
      return rules;
    },
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
    value: {
      required: true,
      // value could be NaN if user clear the field.
      validator: prop => Number.isNaN(prop) || Number.isInteger(prop),
    },
    max: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    suffix: {
      type: String,
      default: '',
    },
    tooltip: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      required: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  watch: {
    selected(value) {
      this.$emit('change', {
        name: this.name,
        value: Number.parseInt(value, 10),
      });
    },
  },
};

/* eslint-disable */
</script>

<style lang="scss">
.number-field {
  input {
    text-align: center;
  }
}
</style>

<template lang="pug">
InputField(:label="label", :tooltip="tooltip").number-field
  v-text-field(
    v-model='selected', type='number', :placeholder="placeholder",
    :max="max", :min="min", :suffix="suffix", :rules="rules")

</template>
