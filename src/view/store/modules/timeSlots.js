import { EVENTS } from 'constants';
import common from '../common.js';

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
  return json;
}

export default {
  namespaced: true,
  initState() {
    return {
      availableSlots: [],
      selectedSlot: null,
      name: '',
      email: '',
    };
  },
  mutations: {
    selectTimeSlot(state, payload) {
      state.selectedSlot = payload.selected ? payload.slot : null;
    },
    update: common.mutations.update,
    setTimeSlots(state, payload) {
      state.meetingWindowProps = Object.assign({}, payload.meetingWindow);
      state.availableSlots = payload.availableSlots || [];
      state.selectedSlot = null;
    },
  },
  actions: {
    async getTimeSlots({ dispatch, commit, rootState }) {
      const meetingWindow = await dispatch(
        'meetingWindow/getMeetingWindow', {
          meetingWindowId: rootState.launchOptions.schedule.meetingWindowId,
        }, { root: true },
      );
      const timeSlots = await dispatch('api/request', {
        options: {
          method: 'get',
          uri: `windows/${meetingWindow.id}/time-slots`,
          loading: 'timeSlots/timeSlots',
        },
      }, { root: true });
      commit({
        type: 'setTimeSlots',
        availableSlots: timeSlots.time_slots,
      });
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
    submit({ dispatch, state, rootState }, payload) {
      const json = getJson(state, payload.recaptchaToken);
      const meetingWindowId = rootState.meetingWindow.id;
      dispatch('event', {
        event: EVENTS.PRE_CONFIRM_SCHEDULE,
      }, { root: true });

      return dispatch({
        type: 'api/request',
        options: {
          method: 'post',
          data: json,
          uri: `windows/${meetingWindowId}/schedule`,
          loading: 'timeSlots/submit',
        },
      }, { root: true }).then((responseData) => {
        dispatch('event', {
          event: EVENTS.CONFIRM_SCHEDULE,
          schedule: responseData,
        }, { root: true });
        return responseData;
      });
    },
  },
};
