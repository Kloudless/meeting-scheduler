
import { mapState } from 'vuex';
import { SUBMIT_STATUS, EVENTS } from 'constants';
import Title from '../common/Title';
import Button from '../common/Button';

export default {
  name: 'MeetingWindowDeletion',
  components: {
    Title,
    Button,
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
    afterSubmit() {
      const { afterSubmit } = this.launchOptions;
      if (afterSubmit.showResult) {
        this.$router.push(`/meetingWindowCompletion/${SUBMIT_STATUS.DELETED}`);
      } else {
        this.$store.dispatch('event', {
          event: EVENTS.CLOSE,
        });
      }
    },
    submit() {
      const promise = this.$store.dispatch('meetingWindow/delete');
      promise.then(() => this.afterSubmit());
    },
    cancel() {
      this.$router.push('/meetingWindow/');
    },
  },
};
