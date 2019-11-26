<script>
import InputField from './InputField';
import { isRequired } from '../../utils/form_validator';

export default {
  name: 'Dropdown',
  components: {
    InputField,
  },
  data() {
    const { options, value } = this.$props;
    return {
      selected: this.getSelected(options, value),
    };
  },
  watch: {
    options(newOptions) {
      this.selected = this.getSelected(newOptions, this.$props.value);
    },
    value(newValue) {
      this.selected = this.getSelected(this.$props.options, newValue);
    },
  },
  computed: {
    rules() {
      const { required } = this.$props;
      return required ? [isRequired] : [];
    },
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      required: true,
      // Value could be undefined if user clear the field.
      // Value could also be null before connecting to a calendar service.
      validator: prop => (
        typeof prop === 'string' || prop === null || prop === undefined
      ),
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getSelected(options, value) {
      if (options.length === 0) {
        return '';
      }
      let selected = options.findIndex(option => option.value === value);
      if (selected === -1) {
        selected = 0;
        this.onChange(options[selected].value);
      }
      return options[selected].value;
    },
    onChange(value) {
      this.$emit('update', { name: this.name, value });
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">

InputField(:label="label")
  v-autocomplete(
    v-model="selected", :items="options", :rules="rules",
    item-text="text", :label="placeholder", :loading="loading"
    @change="onChange", :hide-details="hideDetails")

</template>
