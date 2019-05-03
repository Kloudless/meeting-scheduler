/* global BASE_URL */
/**
 * Vuex sub module to handle Kloudless API request, record parameters for
 * API requests, and toggle flags for loading status
 */
import axios from 'axios';
import common from '../common.js';

const baseUrl = BASE_URL;

const schema = {
  errorMessage: null,
  appId: null,
  loading: {
    meetingWindow: {
      submit: false,
    },
    timeSlots: {
      timeSlots: true,
      submit: false,
    },
    account: {
      account: false,
      calendar: false,
    },
  },
};

export default {
  namespaced: true,
  state: common.createState(schema),
  mutations: {
    setErrorMessage(state, payload) {
      state.errorMessage = payload.message;
    },
    loading(state, payload) {
      const flags = payload.flag.split('/');
      state.loading[flags[0]][flags[1]] = payload.loading;
    },
    reset: common.mutations.createResetMutation(schema),
  },
  actions: {
    request({ rootState, commit }, payload) {
      /** payload.options
       * uri, method, data, params, baseApi, onSuccess, onError, loading
       */
      const { account } = rootState;
      const options = Object.assign({
        method: 'GET',
        baseApi: false,
      }, payload.options);

      const prefix = options.baseApi ?
        `v1/accounts${account.id ? `/${account.id}` : ''}` : 'v1/meetings';

      const token = rootState.launchOptions.eventId || account.token;

      const promise = axios({
        method: options.method,
        url: `${baseUrl}/${prefix}/${options.uri}`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'X-Kloudless-Source': 'meeting-scheduler/1.0.1',
        },
        params: options.params,
        data: options.data,
      });

      if (options.loading) {
        commit({
          type: 'loading',
          flag: options.loading,
          loading: true,
        });
      }

      return promise
        .then((response) => {
          commit({
            type: 'setErrorMessage',
            message: null,
          });
          return (options.onSuccess || Object)(response.data);
        }).catch((error) => {
          const message = `Error: ${error.message}. Please contact Support.`;
          commit({
            type: 'setErrorMessage',
            message,
          });
          (options.onError || Object)(error);
          throw error;
        })
        .finally(() => {
          if (options.loading) {
            commit({
              type: 'loading',
              flag: options.loading,
              loading: false,
            });
          }
          (options.onFinish || Object)();
        });
    },
  },
};
