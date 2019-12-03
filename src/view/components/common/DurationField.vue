<script>
import InputField from './InputField';
import ToggleButton from './ToggleButton';
import { isRequired } from '../../utils/form_validator';

export default {
  name: 'DurationField',
  components: {
    InputField,
    ToggleButton,
  },
  data() {
    const { value } = this.$props;
    return {
      custom: false,
      selectedValue: value,
      customValue: '',
    };
  },
  methods: {
    switchCustom(custom) {
      this.custom = custom;
      if (custom === true) {
        this.selectedValue = '';
      }
    },
  },
  computed: {
    finalValue() {
      const { custom, selectedValue, customValue } = this;
      return custom ? customValue : selectedValue;
    },
    rules() {
      const { required } = this.$props;
      return required ? [isRequired] : [];
    },
  },
  watch: {
    finalValue(value) {
      this.$emit(
        'change',
        { name: this.name, value: Number.parseInt(value, 10) },
      );
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
    durations: {
      type: Array,
      required: true,
      default: () => [],
    },
    value: {
      type: Number,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
};

/* eslint-disable */
</script>


<template lang="pug">
//- toggle-buttons is defined in ToggleButtons.vue
InputField(:label="label").duration-field
  v-input(:value="finalValue", :rules="rules")
    v-layout.justify-space-between
      v-btn-toggle(v-model="selectedValue", :mandatory="!custom").my-1
        template(v-for="duration in durations")
          ToggleButton(
            :value="duration.value", :text="duration.text", 
            :caption="duration.caption", @click="switchCustom(false)")
      div(:class="{active: custom}").custom-field
        v-text-field(label="Custom", placeholder="Enter Time", outline,
                     v-model="customValue", mask="###",
                     @click="switchCustom(true)", @focus="switchCustom(true)")

</template>
