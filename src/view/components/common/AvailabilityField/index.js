import AddAvailableTimeForm from '../AddAvailableTimeForm';
import Button from '../Button';
import InputField from '../InputField';
import InputWrapper from '../InputWrapper';
import { isRequired, isWeekdayEqual } from '../../../utils/form_validator';

export default {
  name: 'AvailabilityField',
  components: {
    AddAvailableTimeForm,
    Button,
    InputField,
    InputWrapper,
  },
  data() {
    return {
      availableTimes: [...this.$props.value],
      showForm: false,
      rules: [isRequired],
    };
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    weekday: {
      type: Array,
      required: true,
    },
    startHour: {
      type: String,
      required: true,
    },
    endHour: {
      type: String,
      required: true,
    },
    weekdayOptions: {
      type: Array,
      required: true,
    },
    weekdayPresets: {
      type: Array,
      required: true,
    },
    hourOptions: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  methods: {
    hourText(start, end) {
      const { hourOptions } = this.$props;
      const startHour = hourOptions.find(h => h.value === start);
      const endHour = hourOptions.find(h => h.value === end);
      return `${startHour.text} - ${endHour.text}`;
    },
    weekdayText(weekdays) {
      const { weekdayOptions, weekdayPresets } = this.$props;
      const preset = weekdayPresets.find(
        p => isWeekdayEqual(p.weekdaySet, weekdays),
      );
      if (preset) {
        return preset.text;
      }
      const weekdayTexts = weekdays.map(
        weekday => weekdayOptions.find(o => o.value === weekday).text,
      );
      return `Every ${weekdayTexts.join(', ')}`;
    },
    addAvailableTime(availableTime) {
      this.availableTimes.push({ ...availableTime });
      /**
       * Display add availability button in next tick to ensure the validation
       * is done.
       * Otherwise, you'll see the button's color changes from error to primary
       * quickly when adding the first available time.
       */
      this.$nextTick(this.toggleForm);
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
  },
  watch: {
    availableTimes(value) {
      const { name } = this.$props;
      this.$emit('change', { name, value });
    },
  },
};
