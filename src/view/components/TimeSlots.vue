<script>
import InfiniteLoading from 'vue-infinite-loading';
import {
  MAX_TIME_SLOTS_PER_SCROLL, EVENTS, ACTIONS,
} from 'constants';
import { mapState } from 'vuex';
import date from '../utils/date';
import {
  createTimeZoneDropdownItem, getDefaultTimeZone, TIME_ZONES, LOCAL_TIME_ZONE,
} from '../utils/fixtures';
import TextInput from './common/TextInput';
import Textarea from './common/Textarea';
import InputLabel from './common/InputLabel';
import Title from './common/Title';
import Button from './common/Button';
import TimeSlotBlock from './TimeSlotBlock';
import Dropdown from './common/Dropdown';
import TimeZoneDropdownItem from './TimeZoneDropdownItem';
import SelectedTimeSlot from './SelectedTimeSlot';
import Recaptcha from './common/Recaptcha';


export default {
  name: 'TimeSlots',
  components: {
    InfiniteLoading,
    TextInput,
    Textarea,
    InputLabel,
    Title,
    Button,
    TimeSlotBlock,
    Dropdown,
    TimeZoneDropdownItem,
    SelectedTimeSlot,
    Recaptcha,
  },
  data() {
    const { action } = this.$route.params;
    return {
      // false if beforeMount is resolved.
      initing: true,
      action,
      isUpdateMode: action === ACTIONS.UPDATE,
      step: 0,
      timeSlotsRenderOffset: 0,
      hasMoreTimeSlotsPages: true,
      titles: {
        [ACTIONS.CREATE]: [
          'Choose an available time slot',
          'What\'s your name and email?',
          'Confirm your meeting details',
        ],
        [ACTIONS.UPDATE]: [
          'Change the selected time slot',
          'Change the contact info',
          'Confirm your changes',
        ],
      },
      isTargetFormValid: true,
      // Only used in update mode.
      origTimeSlot: { start: null, end: null, selected: false },
    };
  },
  computed: mapState({
    scheduledEvent: state => state.scheduledEvent,
    meetingWindow: state => state.meetingWindow,
    timeSlots: state => state.timeSlots,
    loading: state => state.api.loading.timeSlots,
    launchOptions: state => state.launchOptions.schedule,
    slotGroups(state) {
      const { availableSlots, timeZone } = state.timeSlots;
      const { timeSlotsRenderOffset } = this;

      const slotGroups = {};
      if (!timeZone) {
        return slotGroups;
      }

      availableSlots.slice(0, timeSlotsRenderOffset).forEach((slot) => {
        const groupKey = this.formatDate('date', slot.start);
        if (typeof slotGroups[groupKey] === 'undefined') {
          slotGroups[groupKey] = [];
        }
        slotGroups[groupKey].push(slot);
      });

      return slotGroups;
    },
    visible: state => state.timeSlots.visible,
    isExtraDescriptionVisible(state) {
      const { action } = this;
      const { visible } = state.timeSlots;
      const { allowEventMetadata } = state.meetingWindow;
      return (
        action === ACTIONS.CREATE && allowEventMetadata
        && visible.extraDescription);
    },
    // bind timeZone exclusively since it is used widely in this view
    timeZone: state => state.timeSlots.timeZone,
    /**
     * The Time Zone Dropdown items would be:
     *   Local Browser Time Zone
     *   Meeting Window Time Zone
     *   ----- (divider) ---
     *   (Rest of the Time Zones)
     * OR
     *   Local Browser and Meeting Window Time Zone
     *   ----- (divider) ---
     *   (Rest of the Time Zones)
     * If Local Browser time zone and the Meeting Window time zone is the same.
     */
    timeZones: (state) => {
      const { meetingWindow: { timeZone: organizerTimeZone } } = state;
      const timeZones = [
        createTimeZoneDropdownItem(LOCAL_TIME_ZONE, '(Current)'),
      ];
      if (organizerTimeZone) {
        if (organizerTimeZone === LOCAL_TIME_ZONE) {
          timeZones[0].suffix = '(Current / Organizer\'s)';
        } else {
          timeZones.push(
            createTimeZoneDropdownItem(organizerTimeZone, '(Organizer\'s)'),
          );
        }
      }
      timeZones.push({ divider: true });
      return timeZones.concat(
        TIME_ZONES.filter(item => (
          item.value !== LOCAL_TIME_ZONE && item.value !== organizerTimeZone)),
      );
    },
  }),
  async beforeMount() {
    try {
      // Since Vue won't wait for beforeMount being resolved. So we have to
      // control whether the initialization finishes.
      this.initing = true;
      if (this.action === ACTIONS.UPDATE) {
        // Set initial value from scheduled event.
        await this.$store.dispatch('timeSlots/loadScheduledEvent');
        this.origTimeSlot = {
          start: this.scheduledEvent.start,
          end: this.scheduledEvent.end,
          selected: true,
        };
        this.selectTimeSlot(this.origTimeSlot);
      }

      if (!this.meetingWindow.id) {
        await this.$store.dispatch({
          type: 'meetingWindow/getMeetingWindow',
          meetingWindowId: this.launchOptions.meetingWindowId,
        });
      }
      this.selectDefaultTimeZone();
      this.initing = false;
    } catch (err) {
      console.error(err);
    }
  },
  props: [],
  watch: {
    'launchOptions.timeZone': 'selectDefaultTimeZone',
    'meetingWindow.timeZone': 'selectDefaultTimeZone',
  },
  methods: {
    selectTimeZone(event) {
      if (!event.value) {
        // Do not process when dropdown value is cleared
        return;
      }
      this.$store.commit({
        type: 'timeSlots/update',
        name: 'timeZone',
        value: event.value,
      });
      this.timeSlotsRenderOffset = 0;
    },
    selectDefaultTimeZone() {
      this.$store.commit({
        type: 'timeSlots/update',
        name: 'timeZone',
        value: getDefaultTimeZone(this.launchOptions, this.meetingWindow),
      });
    },
    selectTimeSlot(slot) {
      this.$store.commit('timeSlots/selectTimeSlot', { slot });
    },
    formatDate(format, dateStr) {
      // Make sure this method is called after this.timeZone initialized.
      if (this.timeZone) {
        return date(format, dateStr, this.timeZone);
      }
      return '';
    },
    goToScheduledEventView() {
      this.$router.push('/viewScheduledEvent');
    },
    moveStep(step) {
      this.step += step;
      this.timeSlotsRenderOffset = 0;
    },
    updateInput(event) {
      this.$store.commit({
        type: 'timeSlots/update',
        name: event.name,
        value: event.value,
      });
    },
    afterSubmit() {
      const { launchOptions: { afterSchedule }, action } = this;
      if (afterSchedule.showResult) {
        this.$router.push(`/timeSlotsCompletion/${action}`);
      } else {
        this.$store.dispatch('event', {
          event: EVENTS.CLOSE,
        });
      }
    },
    async _submit(recaptchaToken) {
      await this.$store.dispatch('timeSlots/submit', {
        recaptchaToken,
        action: this.action,
      });
      await this.afterSubmit();
    },
    async submit() {
      await this.$refs.recaptcha.execute();
    },
    validateForm() {
      if (this.$refs.form.validate()) {
        this.moveStep(1);
      }
    },
    /**
     * Run after reCAPTCHA successfully verified.
     *
     * @param {string} recaptchaToken - token returned by reCAPTCHA
     */
    onRecaptchaVerify(recaptchaToken) {
      this._submit(recaptchaToken);
    },
    /**
     * Run when any error is encountered by reCAPTCHA
     */
    onRecaptchaError() {
      // Do nothing
    },
    /**
     * Render the next MAX_TIME_SLOTS_PER_SCROLL slots from the time slots list
     * in vuex state when user scrolls to the bottom.
     */
    async infiniteHandler(state) {
      let availableSlotsLength = this.timeSlots.availableSlots.length;
      if (
        (availableSlotsLength - this.timeSlotsRenderOffset
          < MAX_TIME_SLOTS_PER_SCROLL) && this.hasMoreTimeSlotsPages) {
        // if remain slots are not enough for this scroll and there is
        // a next page id from previous response, pull the next page.
        // This condition is also triggered when the view is loaded.
        this.hasMoreTimeSlotsPages = await this.$store.dispatch({
          type: 'timeSlots/getTimeSlots',
        });
      }

      // new time slots might be added, get the latest slot list length
      availableSlotsLength = this.timeSlots.availableSlots.length;

      if (availableSlotsLength) {
        // move render offset, view will be updated automatically
        // because the computed value `slotGroup` will be updated
        this.timeSlotsRenderOffset += MAX_TIME_SLOTS_PER_SCROLL;
        if (this.timeSlotsRenderOffset >= availableSlotsLength) {
          this.timeSlotsRenderOffset = availableSlotsLength;
        }
      }

      if (!availableSlotsLength && !this.hasMoreTimeSlotsPages) {
        // to trigger "no-results"
        state.complete();
      } else {
        state.loaded();
        if (this.timeSlotsRenderOffset === availableSlotsLength
            && !this.hasMoreTimeSlotsPages) {
          // disable the infinite scroll to fetch more time slots
          // and show the message about "no more items"
          state.complete();
        }
      }
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
v-layout(column).time-slots
  div(v-if="initing")
    Title Retrieving Event Details...
  div(v-else)
    Title {{ titles[action][step] }}

  template(v-if="step === 0")
    div.timeslots-scroll-panel
      template(v-if="!initing")
        div(v-if="isUpdateMode")
          div.text-xs-left.font-size--subtitle.secondary--text.font-weight-medium
            | {{ formatDate('date', origTimeSlot.start) }}
            |
            span.font-size--md (current)
            v-layout(row, wrap, px-3, pb-2)
              TimeSlotBlock(
                :timeSlot="origTimeSlot", :timeZone="timeZone",
                @onClick="selectTimeSlot")
          hr.mb-3
        div(v-for="(slots, date) in slotGroups", :key="date")
          div.text-xs-left.font-size--subtitle.secondary--text.font-weight-medium
            | {{ date }}
          v-layout(row, wrap, px-3, pb-3)
            .time-slot-block(v-for="(slot, index) in slots", :key="index")
              TimeSlotBlock(:timeSlot="slot", :timeZone="timeZone",
                            @onClick="selectTimeSlot")
        InfiniteLoading(@infinite="infiniteHandler", :identifier="timeZone")
          div(slot="spinner")
            div.progress-container
              v-progress-circular(size="70", color="primary", indeterminate)
          div(slot="no-more").font-size--subtitle.secondary--text
            | No more time slots.
          div(slot='no-results').font-size--subtitle.secondary--text
            | Sorry. There are no available times for this event.
    div.pt-3.pb-4
      v-layout(row)
        Dropdown(
            v-if="meetingWindow.id", :required="true",
            label="Time Zone", name="timeZone", :value="timeZone",
            :options="timeZones", @update="selectTimeZone",
            :loading="!timeZone")
          template(#item="item")
            TimeZoneDropdownItem(:item="item")
          template(#selection="item")
            TimeZoneDropdownItem(:item="item")
      v-layout(row, reverse, justify-space-between)
        Button.ma-0(@click="moveStep(1)", :disabled="!timeSlots.selectedSlot")
          | Next
        Button.ma-0(v-if="isUpdateMode", @click="goToScheduledEventView")
          | Back

  template(v-if="step === 1")
    div.timeslots-scroll-panel
      v-form(ref="form", v-model="isTargetFormValid", lazy-validation)
        TextInput(
          v-if="visible.name",
          name="name", label="Name *", :value="timeSlots.name",
          required,
          placeholder="Johnny Appleseed", @update="updateInput")
        TextInput(
          v-if="visible.email",
          name="email", label="Email *", :value="timeSlots.email",
          required, type="email",
          placeholder="youremail@example.com", @update="updateInput")
        Textarea(v-if="isExtraDescriptionVisible"
          name="extraDescription" label="Note",
          :value="timeSlots.extraDescription",
          placeholder="Additional Information", @update="updateInput")
    div.pt-3.pb-4
      v-layout(row, wrap, justify-space-between)
        Button(@click="moveStep(-1)").ma-0
          | Back
        Button(@click="validateForm", :disabled="!isTargetFormValid").ma-0
          | Next

  template(v-if="step === 2")
    div.timeslots-scroll-panel.text-xs-left
      div.mb-4
        div.font-size--subtitle.secondary--text.font-weight-bold
          | {{ meetingWindow.title }}
        div.secondary--text.font-size--md
          | {{ meetingWindow.location }}
      div.mb-4
        InputLabel.mb-1 SCHEDULED TIME
        SelectedTimeSlot(
          :start="timeSlots.selectedSlot.start",
          :end="timeSlots.selectedSlot.end",
          :timeZone="timeZone")
      div.mb-4
        InputLabel.mb-1 CONTACT INFO
        div.font-size--lg.secondary--text.font-weight-bold {{ timeSlots.name }}
        div.font-size--md.secondary--text {{ timeSlots.email }}
      Textarea(v-if="isExtraDescriptionVisible && timeSlots.extraDescription"
               name="extraDescription" label="Note",
               :value="timeSlots.extraDescription", :readonly="true")
    div.pt-3.pb-4
      v-layout(row, wrap, justify-space-between)
        Button(@click="moveStep(-1)", :disabled="loading.submit").ma-0 Back
        Button(@click="submit" :loading="loading.submit").ma-0
          template(v-if="isUpdateMode")
            | Update Meeting
          template(v-else)
            | Schedule Meeting
  Recaptcha(
    ref="recaptcha",
    @onVerify="onRecaptchaVerify", @onError="onRecaptchaError")
</template>
