import moment from 'moment';
import 'moment-timezone';
import { mapState } from 'vuex';
import date from '../../utils/date';
import TextInput from '../common/TextInput';
import Title from '../common/Title';
import Button from '../common/Button';


export default {
  name: 'TimeSlots',
  components: {
    TextInput,
    Title,
    Button,
  },
  data() {
    return {
      step: 0,
      stepTitles: [
        'Choose an available time slot',
        'What\'s your name and email?',
        'Confirm your meeting details',
      ],
      isTargetFormValid: true,
      timezone: moment.tz.guess(),
    };
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    timeSlots: state => state.timeSlots,
    loading: state => state.api.loading.timeSlots,
    slotGroups(state) {
      const availableSlots = state.timeSlots.availableSlots || [];

      const slotGroups = {};

      availableSlots.forEach((slot) => {
        const offsetStartDate = moment(slot.start);

        const groupKey = offsetStartDate.format('YYYY-MM-DD');
        if (typeof slotGroups[groupKey] === 'undefined') {
          slotGroups[groupKey] = [];
        }
        slotGroups[groupKey].push(slot);
      });

      return slotGroups;
    },
  }),
  mounted() {
    if (!this.meetingWindow.id) {
      this.$store.dispatch({
        type: 'timeSlots/getTimeSlots',
        eventId: this.$route.params.eventId,
      });
    }
  },
  props: [
  ],
  methods: {
    selectTimeSlot(slot, selected) {
      this.$store.commit({
        type: 'timeSlots/selectTimeSlot',
        slot,
        selected,
      });
    },
    formatDate(format, dateStr) {
      return date(format, dateStr);
    },
    moveStep(step) {
      this.step += step;
    },
    updateInput(event) {
      this.$store.commit({
        type: 'timeSlots/update',
        name: event.name,
        value: event.value,
      });
    },
    submit() {
      const promise = this.$store.dispatch({
        type: 'timeSlots/submit',
      });
      promise.then(() => {
        this.$router.push('/timeSlotsDone/');
      });
    },
  },
};
