<script>
import Button from './common/Button';
import date from '../utils/date';

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
    },
  },
  computed: {
    startHour() {
      const { timeSlot, timeZone } = this;
      if (timeZone) {
        return date('hour', timeSlot.start, timeZone);
      }
      return '';
    },
    startAmPm() {
      const { timeSlot, timeZone } = this;
      if (timeZone) {
        return date('amPm', timeSlot.start, timeZone);
      }
      return '';
    },
    endHour() {
      const { timeSlot, timeZone } = this;
      if (timeZone) {
        return date('hour', timeSlot.end, timeZone);
      }
      return '';
    },
    endAmPm() {
      const { timeSlot, timeZone } = this;
      if (timeZone) {
        return date('amPm', timeSlot.end, timeZone);
      }
      return '';
    },
  },
  methods: {
    selectSlot() {
      this.$emit('onClick', this.timeSlot);
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
Button.time-slot(:padding="false"
       :btnProps="{depressed: !timeSlot.selected, outline: !timeSlot.selected}",
       @click="selectSlot")
  v-layout(v-if="timeSlot.selected", row, wrap, align-center, justify-space-around)
    v-flex
      div.time-slot__hour.on-primary-variant--text
        | {{ startHour }}
      div.time-slot__ampm.on-secondary-variant--text
        | {{ startAmPm }}
    v-flex
      div.hour-to.on-secondary-variant--text.pt-1
        | —
      //- required for en-dash to align with hours
    v-flex
      div.time-slot__hour.on-primary-variant--text
        | {{ endHour }}
      div.time-slot__ampm.on-secondary-variant--text
        | {{ endAmPm }}
  template(v-else)
    span.time-slot__hour.pr-1.primary--text
      | {{ startHour }}
    span.time-slot__ampm.on-secondary-variant--text
      | {{ startAmPm }}

</template>
