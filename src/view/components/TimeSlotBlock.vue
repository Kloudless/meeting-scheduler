<script>
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

/* eslint-disable */
</script>

<style lang="scss">
.hour-block {
  padding: 8px;
  width: 120px;
  height: 55px !important;
  .hour {
    font-size: 16px;
    font-weight: bold;
  }
  .ampm {
    font-size: 12px;
  }
}

</style>

<template lang="pug">
Button(:padding="false"
       :btnProps="{depressed: !timeSlot.selected, outline: !timeSlot.selected}",
       @click="selectSlot").hour-block
  v-layout(v-if="timeSlot.selected", row, wrap, align-center, justify-center)
    v-flex(xs4)
      div.hour {{ formatDate('hour', timeSlot.start) }}
      div.ampm.white--text.opacity-4
        | {{ formatDate('amPm', timeSlot.start) }}
    v-flex(xs1)
      div.hour-to.white--text.opacity-4.pt-1 —
    v-flex(xs4)
      div.hour {{ formatDate('hour', timeSlot.end) }}
      div.ampm.white--text.opacity-4
        | {{ formatDate('amPm', timeSlot.end) }}
  template(v-else)
    span.hour.pr-1 {{ formatDate('hour', timeSlot.start) }}
    span.ampm.primary--text.opacity-4
      | {{ formatDate('amPm', timeSlot.start) }}

</template>
