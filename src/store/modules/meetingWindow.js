import moment from 'moment';
import common from '../common.js';

function getJson(state) {
  // basic props
  const json = {
    title: state.title,
    location: state.location,
    description: state.description,
    duration: state.duration,
    organizer: state.organizer,
  };

  const start = moment(state.beginHour, 'HH:mm:ss')
    .utcOffset(state.utcOffset, true);
  const end = moment(state.endHour, 'HH:mm:ss')
    .utcOffset(state.utcOffset, true);
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

const schema = {
  id: null,
  title: '',
  duration: '',
  organizer: '',
  location: '',
  description: '',
  access: '',
  utcOffset: moment().format('Z'),
  weekday: '',
  beginHour: '08:00:00',
  endHour: '17:00:00',
};

export default {
  namespaced: true,
  state: common.createState(schema),
  mutations: {
    update: common.mutations.update,
    reset: common.mutations.createResetMutation(schema),
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
          uri: 'windows/',
          method: 'post',
          data: json,
          loading: 'meetingWindow/submit',
          onSuccess: responseData => responseData.public_choice_token,
        },
      }, { root: true });
    },
  },
};
