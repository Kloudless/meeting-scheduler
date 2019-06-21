
import InputField from '../InputField';
import { options } from '../../../utils/fixtures.js';

export default {
  name: 'WeekdayPicker',
  components: {
    InputField,
  },
  data() {
    return {
      weekdays: options.weekdays,
      selectedWeekdays: [],
      selectedPreset: '',
      presets: options.weekdayPresets,
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
  },
  methods: {
    input() {
      this.selectedPreset = '';
    },
    validator(weekdays) {
      if (weekdays.length === 0) {
        return 'This field is required.';
      }
      return true;
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
