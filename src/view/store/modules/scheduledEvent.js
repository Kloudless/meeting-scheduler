export default {
  namespaced: true,
  initState() {
    return {
      meetingWindowId: null,
      // A random string used to identify the scheduled Event. Don't confuse
      // scheduled event ID and calendar event ID.
      id: null,
      start: null,
      end: null,
      attendees: [],
      description: null,
    };
  },
  mutations: {
    setScheduledEvent(state, payload) {
      const { scheduledEvent } = payload;
      state.start = scheduledEvent.start;
      state.end = scheduledEvent.end;
      state.attendees = scheduledEvent.attendees;
      state.description = scheduledEvent.description;
      state.id = scheduledEvent.scheduled_event_id;
      state.meetingWindowId = scheduledEvent.meeting_window_id;
    },
  },
  actions: {
    /**
     * Given scheduledEventId, fetch the scheduled event's metadata including
     * meeting window ID.
     */
    async fetch({ rootState, dispatch, commit, state }) {
      const { launchOptions: { schedule: { scheduledEventId } } } = rootState;
      if (scheduledEventId === state.id) {
        return state;
      }
      const scheduledEvent = await dispatch(
        'api/request',
        {
          options: {
            method: 'get',
            uri: `events/${scheduledEventId}`,
          },
        },
        { root: true },
      );
      commit('setScheduledEvent', { scheduledEvent });
      return state;
    },
    async delete({ dispatch, state, commit }, payload) {
      const { recaptchaToken } = payload;
      let uri = `events/${state.id}`;
      if (recaptchaToken) {
        uri += `?recaptcha_token=${recaptchaToken}`;
      }
      await dispatch(
        'api/request',
        {
          options: {
            method: 'delete',
            uri,
          },
        },
        { root: true },
      );
      commit('reset');
    },
  },
};
