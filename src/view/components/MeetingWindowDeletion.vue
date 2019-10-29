<script>

import { mapState } from 'vuex';
import { SUBMIT_STATUS, EVENTS } from 'constants';
import Title from './common/Title';
import Button from './common/Button';

export default {
  name: 'MeetingWindowDeletion',
  components: {
    Title,
    Button,
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    loading: state => state.api.loading.meetingWindow,
    launchOptions: state => state.launchOptions.setup,
  }),
  props: [
  ],
  methods: {
    afterSubmit() {
      const { afterSubmit } = this.launchOptions;
      if (afterSubmit.showResult) {
        this.$router.push(`/meetingWindowCompletion/${SUBMIT_STATUS.DELETED}`);
      } else {
        this.$store.dispatch('event', {
          event: EVENTS.CLOSE,
        });
      }
    },
    submit() {
      const promise = this.$store.dispatch('meetingWindow/delete');
      promise.then(() => this.afterSubmit());
    },
    cancel() {
      this.$router.push('/meetingWindow/');
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
div
  Title Delete Event
  div.mt-5.headline
    | Are you sure you want to delete 
    span.success--text {{ meetingWindow.title }}
    | ?
  div.mt-5
    p
      Button(@click="cancel")
        | No, go back to editing this event
    p
      Button(@click="submit", :loading="loading.submit", color="error")
        | Yes, delete this event!
</template>
