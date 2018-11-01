import InputField from '../InputField';
import getValidators from '../../../utils/form_validator';

export default {
  name: 'Dropdown',
  components: {
    InputField,
  },
  data() {
    return {
      selected: this.getSelected(this.options),
      formRules: getValidators(['required']),
    };
  },
  watch: {
    options(newOptions) {
      this.selected = this.getSelected(newOptions);
    },
  },
  props: [
    'options', 'name', 'value', 'label', 'placeholder', 'update',
    'loading',
  ],
  methods: {
    getSelected(options) {
      if (options.length === 0) {
        return '';
      }
      let selected =
        options.findIndex(option => option.value === this.$props.value);
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
