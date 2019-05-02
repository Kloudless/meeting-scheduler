/* global BASE_URL VERSION */
/**
 * Vuex sub module to handle Kloudless API request, record parameters for
 * API requests, and toggle flags for loading status
 */
import axios from 'axios';
import common from '../common.js';

const baseUrl = BASE_URL;

export default common.createModule({
  namespaced: true,
  initState() {
    return {
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
  },
  mutations: {
    setErrorMessage(state, payload) {
      state.errorMessage = payload.message;
    },
    loading(state, payload) {
      const flags = payload.flag.split('/');
      state.loading[flags[0]][flags[1]] = payload.loading;
    },
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
        'v1/accounts/me' : 'v1/meetings';

      let token;
      switch (options.tokenType) {
        case 'account':
          ({ token } = account);
          break;
        case 'event':
          token = rootState.launchOptions.eventId;
          break;
        default:
          token = '';
      }

      const promise = axios({
        method: options.method,
        url: `${baseUrl}/${prefix}/${options.uri}`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'X-Kloudless-Source': `meeting-scheduler/${VERSION}`,
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
          let message;
          if (error.response) {
            const { response } = error;
            if (response.headers['content-type'] === 'application/json') {
              message = response.data.message || response.statusText;
            } else {
              message = response.statusText;
            }
          } else if (this.request) {
            message = 'There is no response from service';
          } else {
            // The exception is thrown before making a request
            // axios will provide error message in this case
            ({ message } = error);
          }
          const errorMessage = `Error: ${message}. Please contact Support.`;
          commit({
            type: 'setErrorMessage',
            message: errorMessage,
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
});
