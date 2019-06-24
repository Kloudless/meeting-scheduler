import InputField from '../InputField';
import ToggleButton from '../ToggleButton';
import { isRequired } from '../../../utils/form_validator';

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
