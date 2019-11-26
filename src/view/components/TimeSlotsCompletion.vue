<script>
import { mapState } from 'vuex';
import { EVENTS } from 'constants';
import moment from 'moment-timezone';
import Textarea from './common/Textarea';
import Title from './common/Title';
import InputLabel from './common/InputLabel';
import Button from './common/Button';
import date from '../utils/date';


export default {
  name: 'MeetingWindow',
  components: {
    Title,
    Textarea,
    Button,
    InputLabel,
  },
  data() {
    return {
      timeZone: moment.tz.guess(),
      actionButtonText: {
        close: 'Finish',
      },
    };
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    timeSlots: state => state.timeSlots,
    isModal: state => state.launchOptions.mode === 'modal',
    launchOptions: state => state.launchOptions.schedule,
  }),
  props: [
  ],
  methods: {
    formatDate(format, dateStr) {
      return date(format, dateStr, this.timeZone);
    },
    close() {
      this.$store.dispatch('event', {
        event: EVENTS.CLOSE,
      });
    },
    buttonAction(action) {
      this[action]();
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
div
  Title Meeting scheduled!
  div.mt-5.subheading A calendar invite will be sent to your email shortly.
  div.text-xs-left
    InputLabel.mt-5 EVENT INFO
    div.mb-4
      div.title.accent--text.opacity-9.font-weight-bold
        | {{ meetingWindow.title }}
      div.subheading.accent--text.opacity-9
        | {{ meetingWindow.location }}
    div.mb-4
      div.title.accent--text.opacity-9.font-weight-bold
        | {{ formatDate('fullHour', timeSlots.selectedSlot.start) }}
        | -
        | {{ formatDate('fullHour', timeSlots.selectedSlot.end) }}
        | ({{timeZone}} time)
      div.subheading.accent--text.opacity-9
        | {{ formatDate('date', timeSlots.selectedSlot.start) }}
    Textarea(
      v-if="meetingWindow.allowEventMetadata && timeSlots.extraDescription",
      name="extraDescription" label="Note",
      :value="timeSlots.extraDescription", :readonly="true")
  div.mt-5
    template(v-for="action in launchOptions.afterSchedule.actions")
      Button(
        v-if="actionButtonText[action]",
        @click="buttonAction(action)")
        | {{ actionButtonText[action] }}
  

</template>
