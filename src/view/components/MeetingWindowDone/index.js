import { mapState } from 'vuex';
import Title from '../common/Title';
import TextInput from '../common/TextInput';
import Button from '../common/Button';

export default {
  name: 'MeetingWindowDone',
  components: {
    Title,
    TextInput,
    Button,
  },
  data() {
    const { state } = this.$store;
    return {
      scheduleUrl: state.scheduleUrl,
      actionButtonText: {
        close: 'Finish',
        restart: 'Create Another Event',
      },
    };
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    launchOptions: state => state.launchOptions.setup,
  }),
  props: [
  ],
  methods: {
    restart() {
      this.$store.commit({
        type: 'meetingWindow/reset',
      });
      this.$router.push('/meetingWindow/');
    },
    close() {
      this.$store.dispatch('event', {
        event: 'close',
      });
    },
    buttonAction(action) {
      this[action]();
    },
  },
};
