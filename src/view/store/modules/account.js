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
    },
    setCalendars(state, payload) {
      state.calendars = payload.calendars;
    },
    setCalendarId(state, payload) {
      state.calendarId = payload.calendarId;
    },
  },
  actions: {
    async setAccount({ dispatch, commit, rootState, state }, payload) {
      const { id = null, account = null, token = null } = payload;
      const { bookingCalendarId: showBookingCalendarId }
        = rootState.meetingWindow.visible;
      const isEditMode = rootState.launchOptions.setup.meetingWindowId;
      commit({
        type: 'setAccount', id, account, token,
      });
      // account is included in authenticatorjs response
      if (!account) {
        // if initialized via Meeting Scheduler param, query account detail
        // to get account name
        try {
          const accountObj = await dispatch(
            'api/getAccount', null, { root: true },
          );
          commit({
            type: 'setAccount',
            id: accountObj.id,
            account: accountObj.account,
            token,
          });
        } catch (err) {
          commit('reset');
          if (isEditMode || !showBookingCalendarId) {
            /**
             *  block rendering view in the following cases:
             *  1. is edit mode
             *  2. is create mode and bookingCalendarId is invisible
             */
            throw new Error(err);
          }
          return;
        }
      }

      if (!isEditMode) {
        // Create Mode: get calendars and validate calendar ID
        let calendars = [];
        try {
          const data = await dispatch(
            'api/listCalendars', null, { root: true },
          );
          calendars = (data.objects || [])
            .map(cal => ({ id: cal.id, name: cal.name }));
        } catch (ex) {
          calendars = [];
        }

        let { calendarId } = state;
        if (calendarId === 'primary') {
          try {
            const primaryCal = await dispatch(
              'api/getCalendar', { calendarId }, { root: true },
            );
            calendarId = primaryCal.id;
          } catch (err) {
            // pass
          }
        }

        if (!calendarId) {
          calendarId = calendars.length > 0 ? calendars[0].id : null;
        } else if (!calendars.find(cal => cal.id === calendarId)) {
          // calendarId doesn't include in calendars.
          // Reset it to null or the first cal's ID of calendars.
          const message = `Invalid calendar ID: ${calendarId}.`;
          await dispatch(
            'api/setErrorMessage', { message }, { root: true },
          );
          if (!showBookingCalendarId) {
            // block rendering view if bookingCalendarId is invisible
            commit('reset');
            throw new Error(message);
          }
          calendarId = calendars.length > 0 ? calendars[0].id : null;
        }

        commit({ type: 'setCalendars', calendars });
        commit({ type: 'setCalendarId', calendarId });
      }
    },
  },
};
