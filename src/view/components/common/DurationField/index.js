import InputField from '../InputField';
import ToggleButton from '../ToggleButton';
import getValidators from '../../../utils/form_validator';

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
      formRules: getValidators(['required']),
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
  },
  watch: {
    finalValue(value) {
      this.$emit('change', { name: this.name, value });
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
      type: String,
      required: true,
    },
  },
};
