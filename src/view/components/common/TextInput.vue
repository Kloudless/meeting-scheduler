<script>

import InputField from './InputField';
import { isRequired, isEmail } from '../../utils/form_validator';

export default {
  name: 'TextField',
  components: {
    InputField,
  },
  computed: {
    rules() {
      const { required, type } = this;
      const rules = [];
      if (required) {
        rules.push(isRequired);
      }
      if (type === 'email') {
        rules.push(isEmail);
      }
      return rules;
    },
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // Props for input validation, check rules() above for details
    required: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  methods: {},
};

/* eslint-disable */
</script>

<style lang="scss">
@import "../_variables.scss";

.v-input.v-text-field {
  padding-top: 0;
  .v-input__slot{
    &:hover::before {
      border-color: $accent !important;
      opacity: 0.5;
    }
    &::before {
      border-color: $accent;
      opacity: 0.05;
    }
    input::placeholder {
      font-style: italic;
      color: $accent;
      opacity: 0.25;
    }
  }
}

</style>

<template lang="pug">
InputField(:label="label")
  v-text-field(
    :name="name", :placeholder="placeholder", :value="value",
    :readonly="readonly", :rules="rules", 
    @input='$emit("update", {"name": name, "value": $event})')

</template>
