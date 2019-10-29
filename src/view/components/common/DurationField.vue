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

<style lang="scss">
@import "../_variables.scss";

.duration-field {

  .v-btn-toggle {
    height: 72px;
    box-shadow: none;
    .v-btn {
      width: 82px;
    }
  }

  div.custom-field {
    padding: 0px;
    margin: 4px 0px;
    height: 72px;
    width: 112px;
  
    .v-text-field--outline > .v-input__control > .v-input__slot {
      height: 70px;
      border-radius: 2px;
      border: 1px solid $primary;
      font-weight: 700;
      margin: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
  
      .v-text-field__slot {
        display: block;
        text-align: center;
        > label {
          color: $primary;
          position: static !important;
          line-height: 24px;
        }
        > input {
          line-height: 18px;
          text-align: center;
          padding: 0px;
          color: $primary;
          opacity: 0.4;
          position: static !important;
          margin: 0px;

          /* Edge */
          &::-webkit-input-placeholder {
            color: $primary;
            font-style: normal;
            opacity: 1;
          }
          
          /* Internet Explorer 10-11 */
          &:-ms-input-placeholder {
            color: $primary;
            font-style: normal;
            opacity: 1;
          }
          
          &::placeholder {
            color: $primary;
            font-style: normal;
            opacity: 1;
          }
        }
      }
  
      &:hover {
        border: 1px solid $primary !important;
        &::before {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          content: "";
          opacity: 0.12;
          background-color: $primary !important;
          display: block !important;
        }
      }
    }
  
    &.active > .v-text-field--outline > .v-input__control > .v-input__slot {
      background-color: $primary !important;
      .v-text-field__slot > label {
        color: $background !important;
      }
      .v-text-field__slot > input {
        color: $white !important;
        opacity: 0.4;
        &::-webkit-input-placeholder { /* Edge */
          color: $white;
        }
        
        &:-ms-input-placeholder { /* Internet Explorer 10-11 */
          color: $white;
        }
        
        &::placeholder {
          color: $white;
        }
      }
    }
  }  
}

</style>

<template lang="pug">
//- toggle-buttons is defined in ToggleButtons/style.scss
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
