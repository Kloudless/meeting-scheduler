import moment from 'moment-timezone';
import common from '../common.js';

function getJson(state) {
  // basic props
  const json = {
    title: state.title,
    location: state.location,
    description: state.description,
    duration: state.duration,
    organizer: state.organizer,
    time_zone: state.timeZone,
  };

  // TODO: remove state.timeZone which is deprecated since DEV-1997
  const start = moment.tz(state.beginHour, 'HH:mm:ss', state.timeZone);
  const end = moment.tz(state.endHour, 'HH:mm:ss', state.timeZone);

  // if state.endHour is '24:00:00', the time will be recorded as `00:00:00`
  // and the date will be added 1

  json.availability = [
    {
      start: start.format(),
      end: end.format(),
      recurring: {
        month: '*',
        day: '*',
        weekday: state.weekday,
      },
    },
  ];
  return json;
}

export default common.createModule({
  namespaced: true,
  initState() {
    return {
      id: null,
      title: '',
      duration: '',
      organizer: '',
      location: '',
      description: '',
      access: '',
      timeZone: moment.tz.guess(),
      weekday: '',
      beginHour: '08:00:00',
      endHour: '17:00:00',
    };
  },
  mutations: {
    update: common.mutations.update,
    setMeetingWindow(state, payload) {
      Object.assign(state, payload.meetingWindow);
    },
  },
  actions: {
    submit({ state, rootState, dispatch }) {
      const json = getJson(state);
      json.booking_calendar_id = rootState.account.calendarId;

      return dispatch({
        type: 'api/request',
        options: {
          uri: 'windows',
          tokenType: 'account',
          method: 'post',
          data: json,
          loading: 'meetingWindow/submit',
          onSuccess: responseData => responseData.public_choice_token,
        },
      }, { root: true });
    },
  },
});
