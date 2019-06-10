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
import { options } from '../../utils/fixtures.js';

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
  },
  data() {
    return {
      isFormValid: true,
      canRenderView: false,
      options,
    };
  },
  beforeMount() {
    this.updateHourOptions();
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
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    hasCalendar: state => Boolean(state.account.calendarId),
    isUpdating: state => Boolean(state.launchOptions.setup.meetingWindowId),
    loading: state => state.api.loading.meetingWindow,
    launchOptions: state => state.launchOptions.setup,
    calendarSectionTitle: state => (
      state.launchOptions.setup.meetingWindowId ?
        '3. Your Calendar' : '3. Connect Your Calendar'),
  }),
  props: [
  ],
  methods: {
    updateInput(event) {
      this.$store.commit({
        type: 'meetingWindow/update',
        name: event.name,
        value: event.value,
      });
      if (event.name === 'beginHour' || event.name === 'endHour') {
        this.updateHourOptions();
      }
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
    updateHourOptions() {
      const hourOptions = this.options.hours;
      const beginHourIndex = hourOptions
        .findIndex(option => option.value === this.meetingWindow.beginHour);
      const endHourIndex = hourOptions
        .findIndex(option => option.value === this.meetingWindow.endHour);
      this.beginHourOptions = hourOptions.slice(0, endHourIndex);
      this.endHourOptions = hourOptions.slice(beginHourIndex + 1);
    },
  },
};
