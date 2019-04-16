import common from '../common.js';

const schema = {
  id: null,
  account: null,
  token: null,
  calendars: [],
  calendarId: null,
};

export default {
  namespaced: true,
  state: common.createState(schema),
  mutations: {
    setAccount(state, payload) {
      const { id, account, token } = payload;
      state.id = id;
      state.account = account;
      state.token = token;
      state.calendars = [];
      state.calendarId = null;
    },
    setCalendars(state, payload) {
      state.calendars = payload.calendars;
      if (state.calendars instanceof Array && payload.calendars[0]) {
        state.calendarId = state.calendars[0].id;
      }
    },
    setCalendarId(state, payload) {
      state.calendarId = payload.calendarId;
    },
    removeAccount(state) {
      Object.assign(state, schema);
    },
  },
  actions: {
    setAccount({ dispatch, commit }, payload) {
      const { id, account, token } = payload;
      let setAccountPromise;

      commit({
        type: 'setAccount',
        id,
        account,
        token,
      });
      // account is included in authenticatorjs response
      if (account) {
        setAccountPromise = Promise.resolve();
      } else {
        // if initialized via Meeting Scheduler param, query account detail
        // to get account name
        setAccountPromise = dispatch({
          type: 'api/request',
          options: {
            baseApi: true,
            uri: '',
            loading: 'account/account',
            onSuccess: (data) => {
              const accountObj = data.objects[0];
              commit({
                type: 'setAccount',
                id: accountObj.id,
                account: accountObj.account,
                token,
              });
            },
            onError: () => {
              commit('removeAccount');
            },
          },
        }, { root: true });
      }

      setAccountPromise.then(() => {
        dispatch({
          type: 'api/request',
          options: {
            baseApi: true,
            uri: 'cal/calendars',
            loading: 'account/calendar',
            onSuccess: (data) => {
              const calendars = data.objects || [];
              commit({
                type: 'setCalendars',
                calendars: calendars.map(obj => ({
                  id: obj.id,
                  name: obj.name,
                })),
              });
            },
            onError: () => {
              commit({
                type: 'setCalendars',
                calendars: [],
              });
            },
          },
        }, { root: true });
      });
    },
  },
};
