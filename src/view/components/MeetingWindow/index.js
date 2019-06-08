import { mapState } from 'vuex';
import { SUBMIT_STATUS, EVENTS } from 'constants';
import Authenticator from '../Authenticator';
import Accordion from '../common/Accordion';
import Title from '../common/Title';
import TextInput from '../common/TextInput';
import ToggleButtons from '../common/ToggleButtons';
import Dropdown from '../common/Dropdown';
import InputLabel from '../common/InputLabel';
import Button from '../common/Button';
import DurationField from '../common/DurationField';
import NumberField from '../common/NumberField';
import WeekdayPicker from '../common/WeekdayPicker';
import {
  HOURS, TIME_SLOT_INTERVALS, DURATIONS, TIME_ZONES, WEEKDAYS, WEEKDAY_PRESETS,
} from '../../utils/fixtures.js';

export default {
  name: 'MeetingWindow',
  components: {
    Authenticator,
    Title,
    TextInput,
    ToggleButtons,
    Dropdown,
    Accordion,
    InputLabel,
    Button,
    DurationField,
    NumberField,
    WeekdayPicker,
  },
  data() {
    return {
      isFormValid: true,
      canRenderView: false,
      options: {
        timeSlotIntervals: TIME_SLOT_INTERVALS,
        durations: DURATIONS,
        timeZones: TIME_ZONES,
        hours: HOURS,
        weekdays: WEEKDAYS,
        weekdayPresets: WEEKDAY_PRESETS,
      },
    };
  },
  beforeMount() {
    if (this.isUpdating && !this.meetingWindow.id) {
      this.$store.dispatch({
        type: 'meetingWindow/getMeetingWindow',
        meetingWindowId: this.launchOptions.meetingWindowId,
      }).then(() => {
        // only render inputs after meetingWindow is set, to properly
        // load initial values on inputs
        this.canRenderView = true;
      });
    } else {
      this.canRenderView = true;
    }
  },
  computed: {
    ...mapState({
      meetingWindow: state => state.meetingWindow,
      hasCalendar: state => Boolean(state.account.calendarId),
      isUpdating: state => Boolean(state.launchOptions.setup.meetingWindowId),
      loading: state => state.api.loading.meetingWindow,
      launchOptions: state => state.launchOptions.setup,
      calendarSectionTitle: state => (
        state.launchOptions.setup.meetingWindowId ?
          '3. Your Calendar' : '3. Connect Your Calendar'),
    }),
    startHourOptions() {
      const { meetingWindow: { endHour }, options: { hours } } = this;
      const index = hours.findIndex(h => h.value === endHour);
      return hours.slice(0, index);
    },
    endHourOptions() {
      const { meetingWindow: { startHour }, options: { hours } } = this;
      const index = hours.findIndex(h => h.value === startHour);
      return hours.slice(index + 1);
    },
  },
  props: [],
  methods: {
    updateInput(event) {
      this.$store.commit({
        type: 'meetingWindow/update',
        name: event.name,
        value: event.value,
      });
    },
    afterSubmit() {
      const { afterSubmit } = this.launchOptions;
      if (afterSubmit.showResult) {
        this.$router.push(
          `/meetingWindowCompletion/${
            this.isUpdating ? SUBMIT_STATUS.UPDATED : SUBMIT_STATUS.CREATED
          }`,
        );
      } else {
        this.$store.dispatch('event', {
          event: EVENTS.CLOSE,
        });
      }
    },
    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const promise = this.$store.dispatch('meetingWindow/submit', {
        method: this.isUpdating ? 'patch' : 'post',
      });
      promise.then(this.afterSubmit);
    },
    deleteWindow() {
      this.$router.push('/meetingWindowDeletion/');
    },
  },
};
