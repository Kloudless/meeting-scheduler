import { EVENTS, ACTIONS } from 'constants';
import common from '../common.js';
import { getJson as getMeetingWindowJson } from './meetingWindow';

function getJson(state, recaptchaToken) {
  const json = {
    start: state.selectedSlot.start,
    end: state.selectedSlot.end,
    targets: [{
      name: state.name,
      email: state.email,
    }],
    recaptcha_token: recaptchaToken,
  };
  if (state.extraDescription) {
    json.event_metadata = {
      extra_description: state.extraDescription,
    };
  }
  return json;
}

export default {
  namespaced: true,
  initState() {
    return {
      availableSlots: [],
      nextPage: null,
      /**
       * Users might switch between TimeSlots.vue and ViewScheduledEvent.vue
       * several times. So we need `hasNextPage` to record whether there are
       * more pages to load.
       * */
      hasNextPage: true,
      selectedSlot: null,
      name: '',
      email: '',
      extraDescription: '',
      visible: {
        name: true,
        email: true,
        extraDescription: false,
      },
      timeZone: '',
    };
  },
  mutations: {
    selectTimeSlot(state, payload) {
      const { slot } = payload;
      if (state.selectedSlot === slot) {
        state.selectedSlot = null;
        slot.selected = false;
      } else {
        if (state.selectedSlot) {
          state.selectedSlot.selected = false;
        }
        slot.selected = true;
        state.selectedSlot = slot;
      }
    },
    update: common.mutations.update,
    setVisible: common.mutations.setVisible,
    setTimeSlots(state, payload) {
      payload.availableSlots.forEach(slot => state.availableSlots.push(slot));
      state.nextPage = payload.nextPage;
      state.hasNextPage = Boolean(payload.nextPage);
    },
  },
  actions: {
    /**
     * Get available time slots.
     *
     * @param dispatch
     * @param commit
     * @param state
     * @param rootState
     * @returns {Promise<boolean>} - if it has more items.
     */
    async getTimeSlots({ dispatch, commit, state, rootState }) {
      if (state.hasNextPage === false) {
        return state.hasNextPage;
      }
      const meetingWindowId = rootState.meetingWindow.id;
      const timeSlots = await dispatch('api/request', {
        options: {
          method: 'get',
          uri: `windows/${meetingWindowId}/time-slots`,
          loading: 'timeSlots/timeSlots',
          params: {
            page: state.nextPage || null,
          },
        },
      }, { root: true });
      const slotsList = timeSlots.time_slots || [];
      slotsList.forEach((slot) => { slot.selected = false; });
      commit({
        type: 'setTimeSlots',
        availableSlots: slotsList,
        nextPage: timeSlots.next_page,
      });
      return state.hasNextPage;
    },
    /**
     * Create/Update a scheduled event.
     * It will obtain meetingWindow and scheduledEvent from rootState.
     *
     * @param {object} payload
     * @param {string} payload.action - UPDATE or CREATE
     * @param {string=} payload.recaptchaToken - token returned by reCAPTCHA
     */
    async submit({ dispatch, state, rootState, commit }, payload) {
      const { recaptchaToken, action } = payload;
      let json = getJson(state, recaptchaToken);

      const {
        meetingWindow,
        scheduledEvent,
      } = rootState;
      const jsonOverwrite = await dispatch('event', {
        event: EVENTS.PRE_SCHEDULE,
        wait: true,
        meetingWindow: getMeetingWindowJson(meetingWindow),
        schedule: JSON.parse(JSON.stringify(json)),
      }, { root: true });

      if (jsonOverwrite) {
        json = jsonOverwrite;
      }

      if (action === ACTIONS.UPDATE) {
        // We don't support update description yet. API server will ignore this
        // field event if we send it.
        if (json.event_metadata) {
          delete json.event_metadata.extra_description;
        }
      }

      /**
       * responseData example:
       * {
       *    attendees: [{id: null, name: "", email: ""}],
       *    description: "",
       *    start: "2020-11-28T12:30:00+08:00",
       *    end: "2020-11-28T13:30:00+08:00",
       *    id: "event_cG9*****",
       *    scheduled_event_id: "gaY0s*****",
       *    meeting_window_id: "*****"
       * }
       */
      const responseData = await dispatch(
        'api/request',
        {
          options: {
            method: action === ACTIONS.UPDATE ? 'patch' : 'post',
            data: json,
            uri: (action === ACTIONS.UPDATE ?
              `events/${scheduledEvent.id}`
              : `windows/${meetingWindow.id}/schedule`),
            loading: 'timeSlots/submit',
          },
        },
        { root: true },
      );

      commit(
        'scheduledEvent/setScheduledEvent',
        { scheduledEvent: responseData },
        { root: true },
      );
      await dispatch('event',
        { event: EVENTS.SCHEDULE, scheduledEvent: responseData },
        { root: true });

      return responseData;
    },

    /**
     * Set initial value from scheduledEvent.
     */
    async loadScheduledEvent({ rootState, commit }) {
      const { scheduledEvent: { attendees } } = rootState;
      commit('update', { name: 'name', value: attendees[0].name });
      commit('update', { name: 'email', value: attendees[0].email });
    },
  },
};
