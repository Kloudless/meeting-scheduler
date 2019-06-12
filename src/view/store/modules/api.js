/* global VERSION */
/**
 * Vuex sub module to handle Kloudless API request, record parameters for
 * API requests, and toggle flags for loading status
 */
import axios from 'axios';
import { EVENTS } from '../../../constants';

export default {
  namespaced: true,
  initState() {
    return {
      errorMessage: null,
      loading: {
        meetingWindow: {
          submit: false,
          meetingWindow: false,
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
      // DO NOT call this mutation directly
      // use actions.setErrorMessage instead
      state.errorMessage = payload.message;
    },
    loading(state, payload) {
      const flags = payload.flag.split('/');
      state.loading[flags[0]][flags[1]] = payload.loading;
    },
  },
  actions: {
    setErrorMessage({ dispatch, commit }, payload) {
      if (payload.message) {
        dispatch('event', {
          event: EVENTS.ERROR,
          message: payload.message,
        }, { root: true });
      }
      commit({
        ...payload,
        type: 'setErrorMessage',
      });
    },
    request({ rootState, commit, dispatch }, payload) {
      /** payload.options
       * uri, method, data, params, api, onSuccess, onError, loading
       */
      const { account } = rootState;
      const options = Object.assign({
        method: 'GET',
        api: 'meetings',
        resetErrorMessage: true,
      }, payload.options);

      let prefix;
      switch (options.api) {
        case 'meetings':
          prefix = 'v1/meetings/';
          break;
        case 'account':
          prefix = 'v1/accounts/me/';
          break;
        default:
          prefix = '';
          break;
      }

      let token;
      switch (options.tokenType) {
        // TODO: support target token
        case 'account':
          ({ token } = account);
          break;
        default:
          token = '';
      }

      const { baseUrl } = rootState.launchOptions.globalOptions;

      const requestOptions = {
        method: options.method,
        url: `${baseUrl}/${prefix}${options.uri}`,
        headers: {
          Accept: 'application/json',
          'X-Kloudless-Source': `meeting-scheduler/${VERSION}`,
        },
        params: options.params,
        data: options.data,
      };

      if (token) {
        requestOptions.headers.Authorization = `Bearer ${token}`;
      }

      const promise = axios(requestOptions);

      if (options.loading) {
        commit({
          type: 'loading',
          flag: options.loading,
          loading: true,
        });
      }

      return promise
        .then((response) => {
          if (options.resetErrorMessage) {
            dispatch('setErrorMessage', {
              message: null,
            });
          }
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
          } else if (error.request) {
            message = 'There is no response from service';
          } else {
            // The exception is thrown before making a request
            // axios will provide error message in this case
            ({ message } = error);
          }
          const errorMessage = `Error: ${message}. Please contact Support.`;
          dispatch('setErrorMessage', {
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
        });
    },
  },
};
