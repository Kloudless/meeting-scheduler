import { mapState } from 'vuex';
import { EVENTS } from 'constants';
import moment from 'moment-timezone';
import Textarea from '../common/Textarea';
import Title from '../common/Title';
import InputLabel from '../common/InputLabel';
import Button from '../common/Button';
import date from '../../utils/date';


export default {
  name: 'MeetingWindow',
  components: {
    Title,
    Textarea,
    Button,
    InputLabel,
  },
  data() {
    return {
      timeZone: moment.tz.guess(),
      actionButtonText: {
        close: 'Finish',
      },
    };
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    timeSlots: state => state.timeSlots,
    isModal: state => state.launchOptions.mode === 'modal',
    launchOptions: state => state.launchOptions.schedule,
  }),
  props: [
  ],
  methods: {
    formatDate(format, dateStr) {
      return date(format, dateStr, this.timeZone);
    },
    close() {
      this.$store.dispatch('event', {
        event: EVENTS.CLOSE,
      });
    },
    buttonAction(action) {
      this[action]();
    },
  },
};
