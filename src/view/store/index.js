import Vue from 'vue';
import Vuex from 'vuex';
import account from './modules/account';
import meetingWindow from './modules/meetingWindow';
import timeSlots from './modules/timeSlots';
import common from './common';
import api from './modules/api';

Vue.use(Vuex);

// used in tests
export const schema = {
  state: {
    launchOptions: {},
    scheduleUrl: '',
  },
  modules: {
    account,
    meetingWindow,
    timeSlots,
    api,
  },
  mutations: {
    setLaunchOptions(state, payload) {
      state.launchOptions = Object.assign({}, payload.launchOptions);
    },
    setScheduleUrl(state) {
      const meetingWindowId = state.meetingWindow.id;
      state.scheduleUrl = state.launchOptions.setup.scheduleUrl.replace(
        'MEETING_WINDOW_ID', meetingWindowId,
      );
    },
  },
  actions: {
    initialize({ commit }, payload) {
      commit({
        type: 'setLaunchOptions',
        launchOptions: payload.launchOptions,
      });
      commit('meetingWindow/reset');
      commit('timeSlots/reset');
      commit('api/reset');
    },
    /**
     * This action acts as a helper to forward event message
     * from components to EventMessenger and does not modify any state
     */
    event(state, payload) {
      // this.messenger is set in MeetingSchedulerView constructor
      this.messenger.send(payload);
    },
  },
};

export function createModules(storeSchema) {
  Object.keys(storeSchema.modules).forEach((moduleName) => {
    storeSchema.modules[moduleName]
     = common.createModule(storeSchema.modules[moduleName]);
  });
}

export function initStore(messenger) {
  const storeSchema = { ...schema };
  createModules(storeSchema);
  const store = new Vuex.Store(storeSchema);

  store.messenger = messenger;
  return store;
}
