<script>
import { mapState } from 'vuex';
import { SUBMIT_STATUS, EVENTS } from 'constants';
import Title from '../common/Title';
import TextInput from '../common/TextInput';
import Button from '../common/Button';


export default {
  name: 'MeetingWindowCompletion',
  components: {
    Title,
    TextInput,
    Button,
  },
  data() {
    const { state } = this.$store;
    const { params } = this.$route;
    const { submitStatus } = params;

    const actionButtonText = {
      close: 'Finish',
    };

    if (submitStatus === SUBMIT_STATUS.CREATED) {
      actionButtonText.restart = 'Create Another Event';
    }

    let action = '';
    switch (submitStatus) {
      case SUBMIT_STATUS.CREATED:
        action = 'created';
        break;
      case SUBMIT_STATUS.UPDATED:
        action = 'updated';
        break;
      case SUBMIT_STATUS.DELETED:
        action = 'deleted';
        break;
      default:
    }

    return {
      scheduleUrl: state.scheduleUrl,
      action,
      isDeleted: submitStatus === SUBMIT_STATUS.DELETED,
      actionButtonText,
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
    buttonAction(action) {
      this[action]();
    },
  },
};

/* eslint-disable */
</script>

<style lang="scss">
.capitalize {
  text-transform: capitalize;
}

</style>

<template lang="pug">
div
  Title.capitalize Event {{ action }}
  div.headline.mb-3.text-xs-left
    | You have successfully {{ action }} the event 
    span.success--text {{ meetingWindow.title }}
  template(v-if="!isDeleted")
    div.mt-5.mb-3.subheading.text-xs-left.accent--text.opacity-4
      | SHARE YOUR EVENT
    TextInput(label=" ", readonly, :value="scheduleUrl").mb-5
  div.mt-5
    template(v-for="action in launchOptions.afterSubmit.actions")
      Button(
        v-if="actionButtonText[action]",
        @click="buttonAction(action)")
        | {{ actionButtonText[action] }}
  
</template>
