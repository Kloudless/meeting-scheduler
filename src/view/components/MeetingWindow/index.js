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
import AvailabilityField from '../common/AvailabilityField';
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
    AvailabilityField,
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

    const { accountToken, meetingWindowId } = this.launchOptions;
    const promises = [];

    if (accountToken && !this.hasAccount) {
      promises.push(this.$store.dispatch('account/setAccount', {
        token: accountToken,
      }));
    }

    if (this.isEditMode && !this.meetingWindow.id) {
      promises.push(this.$store.dispatch({
        type: 'meetingWindow/getMeetingWindow',
        meetingWindowId,
      }));
    }

    if (this.isEditMode) {
      // edit mode can only be launched if account token is valid
      // and the window exists
      Promise.all(promises).then(() => {
        this.canRenderView = true;
      }).catch(() => {});
    } else {
      // for create mode, we don't care if the token is invalid or not
      this.canRenderView = true;
    }
  },
  computed: {
    ...mapState({
      meetingWindow: state => state.meetingWindow,
      isEditMode: state => Boolean(state.launchOptions.setup.meetingWindowId),
      hasAccount: state => Boolean(state.account.account),
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
            this.isEditMode ? SUBMIT_STATUS.UPDATED : SUBMIT_STATUS.CREATED
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
        method: this.isEditMode ? 'patch' : 'post',
      });
      promise.then(this.afterSubmit);
    },
    deleteWindow() {
      this.$router.push('/meetingWindowDeletion/');
    },
  },
};
