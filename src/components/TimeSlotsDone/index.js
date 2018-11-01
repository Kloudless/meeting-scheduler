import { mapState } from 'vuex';
import moment from 'moment';
import 'moment-timezone';
import Title from '../common/Title';
import Button from '../common/Button';
import date from '../../utils/date';


export default {
  name: 'MeetingWindow',
  components: {
    Title,
    Button,
  },
  data() {
    return {
      timezone: moment.tz.guess(),
    };
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    timeSlots: state => state.timeSlots,
    isModal: state => state.launchOptions.mode === 'modal',
  }),
  props: [
  ],
  methods: {
    formatDate(format, dateStr) {
      return date(format, dateStr);
    },
  },
};
