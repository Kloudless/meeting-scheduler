<script>
import { createTimeZoneDropdownItem } from '../utils/fixtures';
import date from '../utils/date';

export default {
  computed: {
    displayTimeZone() {
      const { timeZone } = this;
      if (timeZone) {
        return createTimeZoneDropdownItem(timeZone).text;
      }
      return '';
    },
    startTime() {
      return this.formatDate('fullHour', this.start);
    },
    endTime() {
      return this.formatDate('fullHour', this.end);
    },
    date() {
      return this.formatDate('date', this.start);
    },
  },
  props: {
    start: {
      type: String,
    },
    end: {
      type: String,
    },
    timeZone: {
      type: String,
    },
  },
  methods: {
    formatDate(format, dateStr) {
      const { timeZone } = this;
      if (timeZone && dateStr) {
        return date(format, dateStr, timeZone);
      }
      return '';
    },
  },
};
/* eslint-disable */
</script>

<template lang="pug">
div
  div.font-size--lg.secondary--text.font-weight-bold
    | {{ startTime }}
    | -
    | {{ endTime }}
  div.font-size--md.secondary--text
    | {{ date }}
    br
    | {{ displayTimeZone }}
</template>
