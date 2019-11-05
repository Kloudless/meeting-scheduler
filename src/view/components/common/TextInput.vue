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

<template lang="pug">
InputField(:label="label").text-input
  v-text-field(
    :name="name", :placeholder="placeholder", :value="value",
    :readonly="readonly", :rules="rules", 
    @input='$emit("update", {"name": name, "value": $event})')

</template>
