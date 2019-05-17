/* global SCHEDULE_URL */

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
    const { eventId } = this.$route.params;
    const url = state.launchOptions.eventUrlFormat || SCHEDULE_URL;
    return {
      shareUrl: url.replace('EVENT_ID', eventId),
    };
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
  }),
  props: [
  ],
  methods: {
    createMeetingWindow() {
      this.$store.commit({
        type: 'meetingWindow/reset',
      });
      this.$router.push('/meetingWindow/');
    },
  },
};
