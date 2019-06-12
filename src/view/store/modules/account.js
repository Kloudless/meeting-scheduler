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
    async setAccount({ dispatch, commit, rootState }, payload) {
      const { id, account, token } = payload;

      const isEditMode = rootState.launchOptions.setup.meetingWindowId;

      commit({
        type: 'setAccount',
        id,
        account,
        token,
      });
      // account is included in authenticatorjs response
      if (!account) {
        // if initialized via Meeting Scheduler param, query account detail
        // to get account name
        try {
          const accountObj = await dispatch('api/request', {
            options: {
              api: 'account',
              uri: '',
              loading: 'account/account',
              tokenType: 'account',
              resetErrorMessage: false,
            },
          }, { root: true });

          commit({
            type: 'setAccount',
            id: accountObj.id,
            account: accountObj.account,
            token,
          });
        } catch (exception) {
          if (isEditMode) {
            // block edit mode if token is invalid
            throw exception;
          } else {
            // for create mode, reset the module, and let the view continue
            // to function
            commit('reset');
            return;
          }
        }
      }

      if (!isEditMode) {
        // get calendars for create mode
        try {
          const data = await dispatch('api/request', {
            options: {
              api: 'account',
              uri: 'cal/calendars',
              loading: 'account/calendar',
              tokenType: 'account',
            },
          }, { root: true });
          const calendars = data.objects || [];
          commit({
            type: 'setCalendars',
            calendars: calendars.map(obj => ({
              id: obj.id,
              name: obj.name,
            })),
          });
        } catch (exception) {
          commit({
            type: 'setCalendars',
            calendars: [],
          });
        }
      }
    },
  },
};
