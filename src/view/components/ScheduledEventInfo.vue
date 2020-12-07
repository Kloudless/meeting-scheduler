<script>
import { mapState } from 'vuex';
import InputLabel from './common/InputLabel';
import SelectedTimeSlot from './SelectedTimeSlot';


export default {
  components: {
    InputLabel,
    SelectedTimeSlot,
  },
  props: {
    // timeZone would be null until being loaded from API server.
    timeZone: {
      type: String,
    },
  },
  computed: mapState({
    meetingWindow: state => state.meetingWindow,
    scheduledEvent: state => state.scheduledEvent,
    timeSlots: state => state.timeSlots,
    // Be careful that state.scheduledEvent.attendees might be null because it's
    // reseted when user deletes it.
    // It happenes when scheduledEvent/delete action finishes but hasn't
    // changed route to TimeSlotsCompletion yet.
    // See onRecaptchaVerify() method in ViewScheduledEvent.vue.
    contact: (state) => {
      const { attendees } = state.scheduledEvent;
      if (attendees && attendees.length > 0) {
        return {
          name: attendees[0].name || '',
          email: attendees[0].email || '',
        };
      }
      return {
        name: '',
        email: '',
      };
    },
  }),
};

/* eslint-disable */
</script>

<template lang="pug">
div
  div.mb-3
    InputLabel.mb-1 TITLE
    div.font-size--lg.secondary--text.font-weight-bold
      | {{ meetingWindow.title }}
  div.mb-3
    InputLabel.mb-1 LOCATION
    div.font-size--lg.secondary--text.font-weight-bold
      | {{ meetingWindow.location }}
  div.mb-3
    InputLabel.mb-1 SCHEDULED TIME
    SelectedTimeSlot(
      :start="scheduledEvent.start", :end="scheduledEvent.end",
      :timeZone="timeZone"
    )
  div.mb-3
    InputLabel.mb-1 CONTACT INFO
    div.font-size--lg.secondary--text.font-weight-bold
      | {{ contact.name }}
    div.font-size--md.secondary--text
      | {{ contact.email }}
  div.mb-3
    InputLabel.mb-1 DSECRIPTION
    div.font-size--md.secondary--text
      | {{ scheduledEvent.description }}
</template>
