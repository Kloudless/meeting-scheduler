export default {
  namespaced: true,
  initState() {
    return {
      id: null,
      account: null,
      token: null,
      calendars: [],
      calendarId: null,
    };
  },
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
  },
  actions: {
    setAccount({ dispatch, commit, rootState }, payload) {
      const { id, account, token } = payload;
      let setAccountPromise;

      const isEditWindow = rootState.launchOptions.setup.meetingWindowId;

      commit({
        type: 'setAccount',
        id,
        account,
        token,
      });
      // account is included in authenticatorjs response
      if (account || isEditWindow) {
        setAccountPromise = Promise.resolve();
      } else {
        // if initialized via Meeting Scheduler param, query account detail
        // to get account name
        setAccountPromise = dispatch('api/request', {
          options: {
            api: 'account',
            uri: '',
            loading: 'account/account',
            tokenType: 'account',
            onSuccess: (accountObj) => {
              commit({
                type: 'setAccount',
                id: accountObj.id,
                account: accountObj.account,
                token,
              });
            },
            onError: () => {
              commit('reset');
            },
          },
        }, { root: true });
      }

      if (!isEditWindow) {
        setAccountPromise.then(() => {
          dispatch('api/request', {
            options: {
              api: 'account',
              uri: 'cal/calendars',
              loading: 'account/calendar',
              tokenType: 'account',
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
      }
    },
  },
};
