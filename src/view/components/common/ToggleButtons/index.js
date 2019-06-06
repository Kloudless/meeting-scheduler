
import InputField from '../InputField';
import ToggleButton from '../ToggleButton';

export default {
  name: 'ToggleButtons',
  components: {
    InputField,
    ToggleButton,
  },
  data() {
    const { value } = this.$props;
    return {
      selected: value,
      type: typeof value,
    };
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
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
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick(value) {
      const { type } = this;
      this.$emit(
        'click',
        {
          name: this.name,
          value: type === 'number' ? Number.parseInt(value, 10) : value,
        },
      );
    },
  },
};
