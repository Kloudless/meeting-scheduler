<script>
import { mapState } from 'vuex';
import { EVENTS } from 'constants';
import moment from 'moment-timezone';
import Textarea from './common/Textarea';
import Title from './common/Title';
import InputLabel from './common/InputLabel';
import SelectedTimeSlot from './SelectedTimeSlot';
import Button from './common/Button';


export default {
  name: 'MeetingWindow',
  components: {
    Title,
    Textarea,
    Button,
    InputLabel,
    SelectedTimeSlot,
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
  div.mt-5.font-size--md.on-primary--text
    | A calendar invite will be sent to your email shortly.
  div.text-xs-left
    InputLabel.mt-5 EVENT INFO
    div.mb-4
      div.font-size--lg.secondary--text.font-weight-bold
        | {{ meetingWindow.title }}
      div.font-size--md.secondary--text
        | {{ meetingWindow.location }}
    SelectedTimeSlot.mb-4
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
