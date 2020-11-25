<script>
import { mapState } from 'vuex';
import { EVENTS, ACTIONS } from 'constants';
import Textarea from './common/Textarea';
import Title from './common/Title';
import InputLabel from './common/InputLabel';
import Button from './common/Button';
import ScheduledEventInfo from './ScheduledEventInfo';
import iziToastHelper from '../utils/izitoast-helper';
import Recaptcha from './common/Recaptcha';
import { LOCAL_TIME_ZONE, getDefaultTimeZone } from '../utils/fixtures';

const STATUS = {
  // initing data
  initing: 'initing',
  // any error occurs and cannot perform any further operations
  error: 'error',
  // is processing deletion
  deleting: 'deleting',
  // ready to display data
  ready: 'ready',
};

export default {
  components: {
    Title,
    Textarea,
    Button,
    InputLabel,
    ScheduledEventInfo,
    Recaptcha,
  },
  data() {
    return {
      status: STATUS.initing,
      timeZone: LOCAL_TIME_ZONE,
    };
  },
  computed: {
    ...mapState({
      meetingWindow: state => state.meetingWindow,
      scheduledEvent: state => state.scheduledEvent,
      launchOptions: state => state.launchOptions.schedule,
    }),
    deleteBtnDisabled() {
      return this.status === STATUS.initing || this.status === STATUS.error;
    },
    deleteBtnLoading() {
      return this.status === STATUS.deleting;
    },
    updateBtnDisabled() {
      return this.status !== STATUS.ready;
    },
    showLoading() {
      return this.status === STATUS.initing || this.status === STATUS.error;
    },
  },
  watch: {
    'launchOptions.timeZone': 'updateTimeZone',
    'meetingWindow.timeZone': 'updateTimeZone',
  },
  async beforeMount() {
    try {
      this.status = STATUS.initing;
      const scheduledEvent = await this.$store.dispatch(
        'scheduledEvent/fetch',
      );
      if (this.meetingWindow.id !== scheduledEvent.meetingWindowId) {
        await this.$store.dispatch(
          'meetingWindow/getMeetingWindow',
          { meetingWindowId: scheduledEvent.meetingWindowId },
        );
      }
      this.updateTimeZone();
      this.status = STATUS.ready;
    } catch (err) {
      console.error(err);
      this.status = STATUS.error;
    }
  },
  methods: {
    updateTimeZone() {
      this.timeZone = getDefaultTimeZone(
        this.launchOptions, this.meetingWindow,
      );
    },
    close() {
      this.$store.dispatch('event', {
        event: EVENTS.CLOSE,
      });
    },
    async updateScheduledEvent() {
      await this.$router.push(`/timeSlots/${ACTIONS.UPDATE}`);
    },
    deleteScheduledEvent() {
      iziToastHelper.confirm(
        'Are you sure you want to delete the scheduled meeting?',
        async () => {
          this.status = STATUS.deleting;
          await this.$refs.recaptcha.execute();
        },
      );
    },
    async onRecaptchaVerify(recaptchaToken) {
      // recaptchaToken might be undefined if recaptcha is disabled.
      await this.$store.dispatch(
        'scheduledEvent/delete', { recaptchaToken },
      );
      await this.$router.push(`/timeSlotsCompletion/${ACTIONS.DELETE}`);
    },
    onRecaptchaError() {
      // Set status to ready so that users can retry.
      this.status = STATUS.ready;
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
v-layout(column).time-slots
  div
    Title Your scheduled meeting
  div.timeslots-scroll-panel
    div(v-if="showLoading")
      v-progress-circular(size="70", color="primary", indeterminate)
    div(v-else)
      div.text-xs-left
        ScheduledEventInfo(:timeZone="timeZone")
  div.pt-3.pb-4
    Button(@click="updateScheduledEvent", :disabled="updateBtnDisabled")
      | Update Meeting
    Button(
      color="error", :loading="deleteBtnLoading", :disabled="deleteBtnDisabled",
      @click="deleteScheduledEvent")
      | Delete Meeting
  Recaptcha(
    ref="recaptcha",
    @onVerify="onRecaptchaVerify", @onError="onRecaptchaError")
</template>
