import InputField from '../InputField';

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
    tooltip: String,
    placeholder: {
      type: String,
      default: '',
    },
  },
  methods: {
    // It's not a general method because it needs to access component props.
    // So we put it here instead of form_validator.js
    validator(value) {
      const { max, min } = this.$props;
      const pattern = /[\d]+/;
      if (!pattern.test(value) || value > max || value < min) {
        return `This field should be in ${min} – ${max}`;
      }
      return true;
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
