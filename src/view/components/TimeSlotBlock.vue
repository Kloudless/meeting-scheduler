<script>
import Button from './common/Button';

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

/* eslint-disable */
</script>

<template lang="pug">
Button(:padding="false"
       :btnProps="{depressed: !timeSlot.selected, outline: !timeSlot.selected}",
       @click="selectSlot").hour-block
  v-layout(v-if="timeSlot.selected", row, wrap, align-center, justify-center)
    v-flex(xs4)
      div.hour.on-primary-variant--text {{ formatDate('hour', timeSlot.start) }}
      div.ampm.on-secondary-variant--text
        | {{ formatDate('amPm', timeSlot.start) }}
    v-flex(xs2)
      div.hour-to.on-secondary-variant--text.pt-1 —
      //- required for en-dash to align with hours
      div.ampm.on-secondary-variant--text &nbsp;
    v-flex(xs4)
      div.hour.on-primary-variant--text {{ formatDate('hour', timeSlot.end) }}
      div.ampm.on-secondary-variant--text
        | {{ formatDate('amPm', timeSlot.end) }}
  template(v-else)
    span.hour.pr-1.primary--text {{ formatDate('hour', timeSlot.start) }}
    span.ampm.on-secondary-variant--text
      | {{ formatDate('amPm', timeSlot.start) }}

</template>
