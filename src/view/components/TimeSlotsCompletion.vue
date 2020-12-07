<script>
import { mapState } from 'vuex';
import { EVENTS, ACTIONS } from 'constants';
import Title from './common/Title';
import InputLabel from './common/InputLabel';
import Button from './common/Button';
import TextInput from './common/TextInput';
import ScheduledEventInfo from './ScheduledEventInfo';
import CopyTextField from './common/CopyTextField';


export default {
  components: {
    Title,
    Button,
    InputLabel,
    TextInput,
    ScheduledEventInfo,
    CopyTextField,
  },
  data() {
    const { action } = this.$route.params;
    return {
      action,
      isDeleteMode: action === ACTIONS.DELETE,
      titles: {
        [ACTIONS.CREATE]: 'Meeting scheduled!',
        [ACTIONS.UPDATE]: 'Meeting updated!',
        [ACTIONS.DELETE]: 'Meeting deleted!',
      },
      subtitles: {
        [ACTIONS.CREATE]: ('Your meeting has been scheduled! '
          + 'A calendar invite will be sent to your email shortly.'),
        [ACTIONS.UPDATE]: ('Your scheduled meeting was updated. '
          + 'A calendar invite will be sent to your email shortly.'),
        [ACTIONS.DELETE]: 'Your scheduled meeting was deleted.',
      },
    };
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    isModal: state => state.launchOptions.mode === 'modal',
    launchOptions: state => state.launchOptions.schedule,
    scheduledEvent: state => state.scheduledEvent,
    rescheduleUrl(state) {
      const { action } = this.$route.params;
      if (action === ACTIONS.DELETE) {
        return '';
      }
      const {
        scheduledEvent: { id },
        launchOptions: { schedule: { rescheduleUrl } },
      } = state;
      if (!id || !rescheduleUrl) {
        return '';
      }
      return rescheduleUrl.replace('SCHEDULED_EVENT_ID', id);
    },
    showCloseButton: state => (
      state.launchOptions.schedule.afterSchedule.actions.includes('close')),
    // state.timeSlots.timeZone should be initilized in TimeSlots.vue.
    timeZone: state => state.timeSlots.timeZone,
  }),
  props: [],
  methods: {
    close() {
      this.$store.dispatch('event', {
        event: EVENTS.CLOSE,
      });
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
v-layout(column).time-slots
  div
    Title {{ titles[action] }}
  div.timeslots-scroll-panel
    template(v-if="isDeleteMode")
      div.py-5.font-size--subtitle.on-primary--text
        | {{ subtitles[action] }}
    template(v-else)
      div.pb-4.pt-2.font-size--md.on-primary--text
        | {{ subtitles[action] }}
      div.text-xs-left
        ScheduledEventInfo(:timeZone="timeZone")
  div.pt-3.pb-4.time-slots-completion__footer(
      :class="{[`time-slots-completion__footer--${action}`]:true}")
    CopyTextField.time-slots-completion__copy-field(
      label="Link to Reschedule/Cancel",
      :value="rescheduleUrl")
    Button.time-slots-completion__finish-button(
      v-if="showCloseButton", @click="close") Finish
</template>
