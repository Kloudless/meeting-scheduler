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
    loaderTrusted: false,
    appHasLogo: false,
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
    setAppConfig(state, payload) {
      // eslint-disable-next-line camelcase
      const { logo_url, trusted } = payload.config;
      state.loaderTrusted = Boolean(trusted);
      state.appHasLogo = Boolean(logo_url);
    },
  },
  actions: {
    async initialize({ state, commit, dispatch }, payload) {
      const { launchOptions: { setup, schedule } } = payload;
      const shouldGetAppConfig
        = state.launchOptions.appId !== payload.launchOptions.appId;

      commit({
        type: 'setLaunchOptions',
        launchOptions: payload.launchOptions,
      });

      if (shouldGetAppConfig) {
        dispatch('getAppConfig');
      }

      commit('meetingWindow/reset');
      commit('timeSlots/reset');
      commit('api/reset');
      if (setup && setup.accountToken
          && state.account.token !== setup.accountToken) {
        /** Reset account if accountToken is provided and not the same
         * as current one in store.
         * This would trigger account/setAccount action to re-retrieve
         * account with the new account token.
         */
        commit('account/reset');
      }

      if (setup && setup.formOptions) {
        await dispatch(
          'setupFormOptions',
          { formOptions: setup.formOptions, module: 'meetingWindow' },
        );
      }

      if (schedule && schedule.formOptions) {
        await dispatch(
          'setupFormOptions',
          { formOptions: schedule.formOptions, module: 'timeSlots' },
        );
      }
    },
    /**
     * This action acts as a helper to forward event message
     * from components to EventMessenger and does not modify any state
     */
    event({ state }, payload) {
      const { confidentialData, ...eventData } = payload;
      if (confidentialData && state.loaderTrusted) {
        // this part is only attached to message if loader is in trusted domain
        Object.assign(eventData, confidentialData);
      }
      // this.messenger is set in MeetingSchedulerView constructor
      return this.messenger.send(eventData);
    },
    async getAppConfig({ dispatch, commit, state }) {
      const { launchOptions } = state;
      if (!launchOptions.appId) {
        commit({
          type: 'setAppConfig',
          config: { trusted: false },
        });
        return;
      }

      try {
        const responseData = await dispatch('api/request', {
          options: {
            api: null,
            uri: 'file-explorer/config',
            params: {
              app_id: launchOptions.appId,
              origin: launchOptions.targetPath,
            },
          },
        });
        const hasUserData =
            typeof responseData === 'object' &&
            typeof responseData.user_data === 'object';

        commit({
          type: 'setAppConfig',
          config: hasUserData ? responseData.user_data : {},
        });
      } catch {
        commit({
          type: 'setAppConfig',
          config: {},
        });
      }
    },
    setupFormOptions({ commit }, { formOptions, module }) {
      Object.keys(formOptions)
        .forEach((field) => {
          const { [field]: { visible, default: value } } = formOptions;
          if (value !== undefined && value !== null) {
            commit(`${module}/update`, { name: field, value });
          }
          if (visible !== undefined) {
            commit(`${module}/setVisible`, { name: field, visible });
          }
        });
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
