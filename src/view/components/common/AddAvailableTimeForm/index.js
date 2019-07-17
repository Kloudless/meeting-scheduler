
import InputLabel from '../InputLabel';
import WeekdayPicker from '../WeekdayPicker';
import Dropdown from '../Dropdown';
import Button from '../Button';
import { notInAvailableTimes } from '../../../utils/form_validator';

export default {
  name: 'AddAvailableTimeForm',
  components: {
    InputLabel,
    WeekdayPicker,
    Dropdown,
    Button,
  },
  data() {
    const { weekday, startHour, endHour } = this.$props;
    return {
      availableTime: {
        weekday,
        startHour,
        endHour,
      },
      isFormValid: false,
    };
  },
  props: {
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
    hourOptions: {
      type: Array,
      required: true,
    },
    weekdayPresets: {
      type: Array,
      required: true,
    },
    availableTimes: {
      type: Array,
      required: true,
    },
  },
  watch: {
    availableTimes() {
      this.$refs.form.validate();
    },
  },
  computed: {
    startHourOptions() {
      const { hourOptions } = this.$props;
      const { availableTime: { endHour } } = this;
      const index = hourOptions.findIndex(h => h.value === endHour);
      return hourOptions.slice(0, index);
    },
    endHourOptions() {
      const { hourOptions } = this.$props;
      const { availableTime: { startHour } } = this;
      const index = hourOptions.findIndex(h => h.value === startHour);
      return hourOptions.slice(index + 1);
    },
    rules() {
      const { availableTimes } = this.$props;
      return [notInAvailableTimes(availableTimes)];
    },
  },
  methods: {
    update({ name, value }) {
      this.availableTime[name] = value;
      this.$refs.form.validate();
    },
    add() {
      if (this.$refs.form.validate()) {
        this.$emit('add', this.availableTime);
        // reset value
        const { weekday, startHour, endHour } = this.$props;
        this.availableTime = { weekday, startHour, endHour };
      }
    },
  },
};
