import Button from '../../common/Button';

/**
 * Split out this button component so that when props in the timeSlot object
 * is updated, only the bound TimeSlotBlock component is updated, and
 * TimeSlots component won't be required to re-render all blocks in for loop.
 *
 * For better performance, this component should not contain any
 * reactive data from other components or vuex state other than the `timeSlot`
 * prop passed in.
 */

export default {
  name: 'TimeSlotBlock',
  components: {
    Button,
  },
  props: {
    timeSlot: {
      type: Object,
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
    },
    formatDate: {
      type: Function,
      required: true,
    },
  },
  methods: {
    selectSlot() {
      this.$store.commit({
        type: 'timeSlots/selectTimeSlot',
        slot: this.timeSlot,
      });
    },
  },
};
