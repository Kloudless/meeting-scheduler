<script>
import { mapState } from 'vuex';
import { ACTIONS, EVENTS } from 'constants';
import Title from './common/Title';
import Textarea from './common/Textarea';
import Button from './common/Button';
import CopyTextField from './common/CopyTextField';


export default {
  name: 'MeetingWindowCompletion',
  components: {
    Title,
    Textarea,
    Button,
    CopyTextField,
  },
  data() {
    const { state } = this.$store;
    const { params: { action } } = this.$route;
    const buttons = ['close'];
    // Only show 'Create Another Event' button when in creation mode.
    if (action === ACTIONS.CREATE) {
      buttons.push('restart');
    }

    return {
      scheduleUrl: state.scheduleUrl,
      action,
      isDeleted: action === ACTIONS.DELETE,
      buttons,
      buttonTexts: {
        close: 'Finish',
        restart: 'Create Another Event',
      },
    };
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    launchOptions: state => state.launchOptions.setup,
  }),
  props: [
  ],
  methods: {
    restart() {
      this.$store.dispatch('event', { event: EVENTS.RESTART });
      this.$store.commit({
        type: 'meetingWindow/reset',
      });
      this.$router.push('/meetingWindow/');
    },
    close() {
      this.$store.dispatch('event', {
        event: EVENTS.CLOSE,
      });
    },
    onClickHandler(act) {
      this[act]();
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
v-layout(column).time-slots
  div
    Title.capitalize Event {{ action }}d
  div.timeslots-scroll-panel
    div.py-5.font-size--subtitle.on-primary--text
      | You have successfully {{ action }}d the event 
      span.surface--text {{ meetingWindow.title }}
      | .
    template(v-if="!isDeleted")
      div.mt-5.font-size--md.text-xs-left.secondary--text
        | SHARE YOUR EVENT
      CopyTextField(:value="scheduleUrl")
  div.pt-3.pb-4
    template(v-for="act in launchOptions.afterSubmit.actions")
      Button(v-if="buttons.includes(act)", @click="onClickHandler(act)")
        | {{ buttonTexts[act] }}
  
</template>
