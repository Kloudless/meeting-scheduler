<script>
import { mapState } from 'vuex';
import { createTimeZoneDropdownItem } from '../utils/fixtures';
import date from '../utils/date';

export default {
  computed: mapState({
    selectedSlot: state => state.timeSlots.selectedSlot,
    timeZone: state => state.timeSlots.timeZone,
    timeZoneString: state => (
      createTimeZoneDropdownItem(state.timeSlots.timeZone).text
    ),
  }),
  methods: {
    formatDate(format, dateStr) {
      return date(format, dateStr, this.timeZone);
    },
  },
};
/* eslint-disable */
</script>

<template lang="pug">
div
  div.font-size--lg.secondary--text.font-weight-bold
    | {{ formatDate('fullHour', selectedSlot.start) }}
    | -
    | {{ formatDate('fullHour', selectedSlot.end) }}
  div.font-size--md.secondary--text
    | {{ formatDate('date', selectedSlot.start) }}
    br
    | {{ timeZoneString }}
</template>
