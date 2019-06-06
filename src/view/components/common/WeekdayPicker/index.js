
import InputField from '../InputField';
import { isRequired } from '../../../utils/form_validator';
import { WEEKDAY_PRESETS, WEEKDAYS } from '../../../utils/fixtures.js';

export default {
  name: 'WeekdayPicker',
  components: {
    InputField,
  },
  data() {
    return {
      weekdays: WEEKDAYS,
      selectedWeekdays: [],
      selectedPreset: '',
      presets: WEEKDAY_PRESETS,
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
