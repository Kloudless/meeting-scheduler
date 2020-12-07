<script>
import { mapState } from 'vuex';
import { EVENTS, ACTIONS } from 'constants';
import Authenticator from './Authenticator';
import Accordion from './common/Accordion';
import Title from './common/Title';
import TextInput from './common/TextInput';
import ToggleButtons from './common/ToggleButtons';
import Dropdown from './common/Dropdown';
import InputLabel from './common/InputLabel';
import Button from './common/Button';
import DurationField from './common/DurationField';
import NumberField from './common/NumberField';
import AvailabilityField from './common/AvailabilityField';
import {
  HOURS, TIME_SLOT_INTERVALS, DURATIONS, TIME_ZONES, WEEKDAYS, WEEKDAY_PRESETS,
} from '../utils/fixtures.js';
import iziToastHelper from '../utils/izitoast-helper';

export default {
  name: 'MeetingWindow',
  components: {
    Authenticator,
    Title,
    TextInput,
    ToggleButtons,
    Dropdown,
    Accordion,
    InputLabel,
    Button,
    DurationField,
    NumberField,
    AvailabilityField,
  },
  data() {
    return {
      isFormValid: true,
      canRenderView: false,
      options: {
        timeSlotIntervals: TIME_SLOT_INTERVALS,
        durations: DURATIONS,
        timeZones: TIME_ZONES,
        hours: HOURS,
        weekdays: WEEKDAYS,
        weekdayPresets: WEEKDAY_PRESETS,
      },
    };
  },
  beforeMount() {
    const { accountToken, meetingWindowId } = this.launchOptions;
    const promises = [];

    if (accountToken && !this.hasAccount) {
      promises.push(this.$store.dispatch('account/setAccount', {
        token: accountToken,
      }));
    }

    if (this.isEditMode && !this.meetingWindow.id) {
      promises.push(this.$store.dispatch({
        type: 'meetingWindow/getMeetingWindow',
        meetingWindowId,
      }));
    }

    // Do not render view if there are errors
    return Promise.all(promises).then(() => {
      this.canRenderView = true;
    }).catch(() => {
      // pass
    });
  },
  computed: {
    ...mapState({
      meetingWindow: state => state.meetingWindow,
      isEditMode: state => Boolean(state.launchOptions.setup.meetingWindowId),
      hasAccount: state => Boolean(state.account.account),
      loading: state => state.api.loading.meetingWindow,
      launchOptions: state => state.launchOptions.setup,
      calendarSectionTitle: state => (
        state.launchOptions.setup.meetingWindowId ?
          '3. Your Calendar' : '3. Connect Your Calendar'),
    }),
    startHourOptions() {
      const { meetingWindow: { endHour }, options: { hours } } = this;
      const index = hours.findIndex(h => h.value === endHour);
      return hours.slice(0, index);
    },
    endHourOptions() {
      const { meetingWindow: { startHour }, options: { hours } } = this;
      const index = hours.findIndex(h => h.value === startHour);
      return hours.slice(index + 1);
    },
  },
  props: [],
  methods: {
    updateInput(event) {
      this.$store.commit({
        type: 'meetingWindow/update',
        name: event.name,
        value: event.value,
      });
    },
    afterSubmit() {
      const { afterSubmit } = this.launchOptions;
      if (afterSubmit.showResult) {
        this.$router.push(
          '/meetingWindowCompletion/'
          + `${this.isEditMode ? ACTIONS.UPDATE : ACTIONS.CREATE}`,
        );
      } else {
        this.$store.dispatch('event', {
          event: EVENTS.CLOSE,
        });
      }
    },
    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const promise = this.$store.dispatch('meetingWindow/submit', {
        method: this.isEditMode ? 'patch' : 'post',
      });
      promise.then(this.afterSubmit);
    },
    deleteWindow() {
      iziToastHelper.confirm(
        `Are you sure you want to delete "${this.meetingWindow.title}"?`,
        async () => {
          await this.$store.dispatch('meetingWindow/delete');
          const { afterSubmit } = this.launchOptions;
          if (afterSubmit.showResult) {
            this.$router.push(`/meetingWindowCompletion/${ACTIONS.DELETE}`);
          } else {
            await this.$store.dispatch('event', { event: EVENTS.CLOSE });
          }
        },
      );
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
div.meeting-window
  div(v-if="loading.meetingWindow || !canRenderView")
    Title Retrieving Event Details...
    v-progress-circular(size="70", color="primary", indeterminate)
  div(v-else-if="canRenderView")
    Title Set Up Event
    v-form(ref="form", v-model="isFormValid", lazy-validation)
      Accordion(title="1. Fill In Event Details")
        TextInput(v-if="meetingWindow.visible.title",
                  name="title", label="Event Name *",
                  :value="meetingWindow.title", required,
                  placeholder="e.g. Sonoma Wine Tour", @update="updateInput")
        TextInput(
          v-if="meetingWindow.visible.location",
          name="location", label="Location",
          :value="meetingWindow.location",
          placeholder="e.g. 3124 Sonoma Way, Napa, CA 94558",
          @update="updateInput")
        TextInput(
          v-if="meetingWindow.visible.description",
          name="description", label="Description", @update="updateInput",
          :value="meetingWindow.description", placeholder=" ")
        DurationField(
          v-if="meetingWindow.visible.duration",
          required, label="Event Duration *" name="duration",
          :durations="options.durations", :value="meetingWindow.duration",
          @change="updateInput")

      Accordion(title="2. Add Event Availability")
        AvailabilityField(
          label='Availability *', name="availableTimes",
          :value="meetingWindow.availableTimes",
          :weekdayOptions="options.weekdays",
          :weekdayPresets="options.weekdayPresets",
          :hourOptions="options.hours", :weekday="meetingWindow.weekday", 
          :startHour="meetingWindow.startHour",
          :endHour="meetingWindow.endHour", @change="updateInput")

        Accordion(title="Advanced Settings" :expanded="false", small)
          v-layout(row, v-if="meetingWindow.visible.timeSlotInterval")
            ToggleButtons(
              required, label="Time Slot Increments *" name="timeSlotInterval",
              tooltip="Show time slots every 15, 30, 45, or 60 minutes.",
              :options="options.timeSlotIntervals",
              :value="meetingWindow.timeSlotInterval",
              @click="updateInput")
          v-layout(row, v-if="meetingWindow.visible.availabilityRange")
            .availability-range-field
              NumberField(
                required, name="availabilityRange" label="Availability Range *",
                tooltip="Time slots are shown up to the next 1–90 days.",
                placeholder="30",
                :value="meetingWindow.availabilityRange", :min=1, :max=90,
                suffix="days", @change="updateInput")
          v-layout(
              row, wrap,
              v-if="meetingWindow.visible.timeBufferBefore || meetingWindow.visible.timeBufferAfter")
            .time-buffer-field.mr-5(v-if="meetingWindow.visible.timeBufferBefore")
              NumberField(
                required, name="timeBufferBefore" label="Buffer Before *",
                tooltip="Preserve 0-99 minutes buffer before each scheduled event.",
                placeholder="0",
                :value="meetingWindow.timeBufferBefore", :min=0, :max=99,
                suffix="mins", @change="updateInput")
            .hour-to(v-if="meetingWindow.visible.timeBufferBefore")
            .time-buffer-field(v-if="meetingWindow.visible.timeBufferAfter")
              NumberField(
                required, name="timeBufferAfter" label="Buffer After *",
                tooltip="Preserve 0-99 minutes buffer after each scheduled event."
                placeholder="0",
                :value="meetingWindow.timeBufferAfter", :min=0, :max=99,
                suffix="mins", @change="updateInput")

      Accordion(:title="calendarSectionTitle")
        Authenticator(
          v-if="meetingWindow.visible.bookingCalendarId",
          :isEditMode="isEditMode")
        TextInput(
          v-if="meetingWindow.visible.organizer",
          name="organizer", label="Organizer *", required,
          :value="meetingWindow.organizer",
          placeholder="Johnny Appleseed", @update="updateInput")
        Dropdown(
          required, label="Time Zone *", name="timeZone", :value="meetingWindow.timeZone",
          :options="options.timeZones", @update="updateInput")
      div.mt-5
        Button.action-submit(
            @click="submit", :loading="loading.submit",
            :disabled="!isFormValid || loading.delete")
          | {{ isEditMode ? 'Update' : 'Create' }} Event
        Button.action-delete(
            v-if="isEditMode", :loading="loading.delete",
            :disabled="loading.submit", @click="deleteWindow", color="error")
          | Delete Event
</template>
