
import InputField from '../InputField';
import ToggleButton from '../ToggleButton';

export default {
  name: 'ToggleButtons',
  components: {
    InputField,
    ToggleButton,
  },
  data() {
    let value;
    const options = this.$props.options || [];
    if (options.length === 0) {
      value = '';
    }
    let selected =
      options.findIndex(option => option.value === this.$props.value);
    if (selected === -1) {
      selected = 0;
      this.onClick(options[selected].value);
    }
    ({ value } = options[selected]);
    return {
      selected: value,
    };
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      default: '',
    },
  },
  methods: {
    onClick(value) {
      this.$emit('click', { name: this.name, value });
    },
  },
};
