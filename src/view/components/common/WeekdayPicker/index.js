
import { isRequired, isWeekdayEqual } from 'view/utils/form_validator';
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
    hideDetails: {
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
        this.selectedWeekdays = [...preset.weekdaySet];
        this.selectedPreset = preset.value;
      }
    },
    reset(weekdays) {
      const { presets } = this.$props;
      const preset = presets.find(p => isWeekdayEqual(p.weekdaySet, weekdays));
      this.selectedWeekdays = weekdays;
      this.selectedPreset = preset ? preset.value : '';
    },
  },
  watch: {
    value(newValue) {
      this.reset(newValue);
    },
    selectedWeekdays(weekdays) {
      this.$emit('change', { name: this.name, value: weekdays });
    },
  },
  mounted() {
    this.reset(this.$props.value);
  },
};
