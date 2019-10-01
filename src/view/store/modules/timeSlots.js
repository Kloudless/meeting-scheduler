import { EVENTS } from 'constants';
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
      selectedSlot: null,
      name: '',
      email: '',
      extraDescription: '',
      visible: {},
    };
  },
  mutations: {
    selectTimeSlot(state, payload) {
      state.selectedSlot = payload.selected ? payload.slot : null;
    },
    update: common.mutations.update,
    setVisible: common.mutations.setVisible,
    setTimeSlots(state, payload) {
      state.meetingWindowProps = (
        Object.assign({}, payload.meetingWindow));
      state.availableSlots = (
        state.availableSlots.concat(payload.availableSlots));
      state.nextPage = payload.nextPage;
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
    async getTimeSlots({
      dispatch, commit, state, rootState,
    }) {
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
      commit({
        type: 'setTimeSlots',
        availableSlots: timeSlots.time_slots,
        nextPage: timeSlots.next_page,
      });
      return Boolean(timeSlots.next_page);
    },
    /**
     * Schedule the selected time slot.
     *
     * @param {object} payload
     * {
     *    type {string} - action type
     *    recaptchaToken {string} - token returned by reCAPTCHA
     * }
     */
    async submit({ dispatch, state, rootState }, payload) {
      let json = getJson(state, payload.recaptchaToken);

      const { meetingWindow } = rootState;
      const jsonOverwrite = await dispatch('event', {
        event: EVENTS.PRE_SCHEDULE,
        wait: true,
        meetingWindow: getMeetingWindowJson(meetingWindow),
        schedule: JSON.parse(JSON.stringify(json)),
      }, { root: true });

      if (jsonOverwrite) {
        json = jsonOverwrite;
      }

      const responseData = await dispatch({
        type: 'api/request',
        options: {
          method: 'post',
          data: json,
          uri: `windows/${meetingWindow.id}/schedule`,
          loading: 'timeSlots/submit',
        },
      }, { root: true });

      dispatch('event', {
        event: EVENTS.SCHEDULE,
        scheduledEvent: responseData,
      }, { root: true });
      return responseData;
    },
  },
};
