import moment from 'moment-timezone';
import { EVENTS } from 'constants';
import common from '../common.js';

function getJson(state) {
  // basic props
  const json = {
    title: state.title,
    location: state.location,
    description: state.description,
    duration: Number.parseInt(state.duration, 10),
    organizer: state.organizer,
    time_zone: state.timeZone,
    availability_range: state.availabilityRange,
    time_buffer_before: state.timeBufferBefore,
    time_buffer_after: state.timeBufferAfter,
    time_slot_interval: Number.parseInt(state.timeSlotInterval, 10),
  };

  // TODO: remove state.timeZone which is deprecated since DEV-1997
  const start = moment.tz(state.beginHour, 'HH:mm:ss', state.timeZone);
  const end = moment.tz(state.endHour, 'HH:mm:ss', state.timeZone);

  // if state.endHour is '24:00:00', the time will be recorded as `00:00:00`
  // and the date will be added 1

  json.availability = {
    end_repeat: 'NEVER', // TODO: UI: support end_repeat
    available_times: [
      {
        start: start.format(),
        end: end.format(),
        recurring: {
          month: '*',
          day: '*',
          weekday: state.weekday.join(', '),
        },
      },
    ],
  };
  return json;
}

export default {
  namespaced: true,
  initState() {
    return {
      id: null,
      title: '',
      duration: '15',
      organizer: '',
      location: '',
      description: '',
      access: '',
      timeZone: moment.tz.guess(),
      weekday: [],
      beginHour: '08:00:00',
      endHour: '17:00:00',
      recaptchaSiteKey: null,
      timeBufferBefore: 0,
      timeBufferAfter: 0,
      availabilityRange: 30,
      timeSlotInterval: '30',
    };
  },
  mutations: {
    update: common.mutations.update,
    setMeetingWindow(state, payload) {
      const { meetingWindow } = payload;
      const data = {
        id: meetingWindow.id,
        title: meetingWindow.title,
        duration: meetingWindow.duration,
        organizer: meetingWindow.organizer,
        location: meetingWindow.location,
        description: meetingWindow.description,
        timeZone: meetingWindow.time_zone,
        recaptchaSiteKey: meetingWindow.recaptcha_site_key,
      };
      const { available_times: availableTimes } = meetingWindow.availability;
      if (availableTimes && availableTimes[0]) {
        const { recurring, start, end } = availableTimes[0];
        data.weekday = recurring.weekday;
        data.beginHour = start.substr(11, 8);
        data.endHour = end.substr(11, 8);
      }
      Object.assign(state, data);
    },
  },
  actions: {
    async getMeetingWindow({ dispatch, commit }, payload) {
      const meetingWindow = await dispatch({
        type: 'api/request',
        options: {
          method: 'get',
          uri: `windows/${payload.meetingWindowId}`,
          loading: 'meetingWindow/meetingWindow',
        },
      }, { root: true });
      commit({
        type: 'setMeetingWindow',
        meetingWindow,
      });
      return meetingWindow;
    },
    async submit({
      state,
      rootState,
      commit,
      dispatch,
    }, payload) {
      const method = (payload.method || 'post').toLowerCase();

      const json = getJson(state);
      if (method === 'post') {
        json.booking_calendar_id = rootState.account.calendarId;
      }

      dispatch('event', {
        event: EVENTS.PRE_SUBMIT_MEETING_WINDOW,
      }, { root: true });

      const uri = method === 'post' ? 'windows' : `windows/${state.id}`;

      const responseData = await dispatch('api/request', {
        options: {
          uri,
          tokenType: 'account',
          method,
          data: json,
          loading: 'meetingWindow/submit',
        },
      }, { root: true });
      commit({
        type: 'setMeetingWindow',
        meetingWindow: responseData,
      });
      commit({
        type: 'setScheduleUrl',
      }, { root: true });
      /* eslint-enable */
      dispatch('event', {
        event: EVENTS.SUBMIT_MEETING_WINDOW,
        scheduleUrl: rootState.scheduleUrl,
        meetingWindow: responseData,
        confidentialData: {
          accountToken: rootState.account.token,
        },
      }, { root: true });
      return responseData.id;
    },
    async delete({ dispatch, state }) {
      await dispatch('api/request', {
        options: {
          uri: `windows/${state.id}`,
          tokenType: 'account',
          method: 'delete',
          loading: 'meetingWindow/submit',
        },
      }, { root: true });
      dispatch('event', {
        event: EVENTS.DELETE_MEETING_WINDOW,
      }, { root: true });
    },
  },
};
