import { mapState } from 'vuex';
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
      options,
    };
  },
  beforeMount() {
    this.updateHourOptions();
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    hasCalendar: state => Boolean(state.account.calendarId),
    loading: state => state.api.loading.meetingWindow,
    launchOptions: state => state.launchOptions.setup,
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
        this.$router.push('/meetingWindowDone/');
      } else {
        this.$store.dispatch('event', {
          event: 'close',
        });
      }
    },
    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const promise = this.$store.dispatch('meetingWindow/submit');
      promise.then(this.afterSubmit);
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
