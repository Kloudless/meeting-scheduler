
import { isRequired } from 'view/utils/form_validator';
import InputField from '../InputField';

export default {
  name: 'WeekdayPicker',
  components: {
    InputField,
  },
  data() {
    const { value } = this.$props;
    return {
      selectedWeekdays: value,
      selectedPreset: '',
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
    required: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    presets: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    rules() {
      const { required } = this.$props;
      return required ? [isRequired] : [];
    },
  },
  methods: {
    input() {
      // when user click on any single weekday, clear the selected preset.
      this.selectedPreset = '';
    },
    togglePreset(preset) {
      const { selectedPreset } = this;
      if (selectedPreset === preset.value) {
        this.selectedWeekdays = [];
        this.selectedPreset = '';
      } else {
        this.selectedWeekdays = [...preset.weekdays];
        this.selectedPreset = preset.value;
      }
    },
  },
  watch: {
    selectedWeekdays(weekdays) {
      this.$emit('change', { name: this.name, value: weekdays });
    },
  },
};
