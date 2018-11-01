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

  const now = moment().format('YYYY-MM-DD');

  json.availability = [
    {
      start: `${now}T${state.beginHour}${state.utcOffset}`,
      end: `${now}T${state.endHour}${state.utcOffset}`,
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
