/* global VERSION */
/**
 * Vuex sub module to handle Kloudless API request, record parameters for
 * API requests, and toggle flags for loading status
 */
import axios from 'axios';
import { EVENTS } from '../../../constants';
import iziToastHelper from '../../utils/izitoast-helper';

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
    loading(state, payload) {
      const flags = payload.flag.split('/');
      state.loading[flags[0]][flags[1]] = payload.loading;
    },
  },
  actions: {
    /**
     * Fire error event and show error dialog.
     * Ignore if payload.message is empty.
     * @param {object} payload
     * @param {string=} payload.message
     * @param {string=} payload.detail
     * @param {boolean=} payload.fireEvent - Whether to fire error event.
     *  Defaults to true.
     */
    setErrorMessage({ dispatch }, payload = {}) {
      const { message, detail = null, fireEvent = true } = payload;
      if (message) {
        if (fireEvent) {
          // TODO:
          // 1. Sort out what kind of errors should be fired.
          // 2. Send error code.
          dispatch('event', {
            event: EVENTS.ERROR,
            message: payload.message,
          }, { root: true });
        }
        iziToastHelper.error(payload.message, { detail });
      }
    },
    getAccount({ dispatch }) {
      return dispatch('request', {
        options: {
          api: 'account',
          uri: '',
          loading: 'account/account',
          tokenType: 'account',
        },
      });
    },
    listCalendars({ dispatch }) {
      return dispatch('request', {
        options: {
          api: 'account',
          uri: 'cal/calendars',
          loading: 'account/calendar',
          tokenType: 'account',
        },
      });
    },
    getCalendar({ dispatch }, payload) {
      const { calendarId } = payload;
      return dispatch('request', {
        options: {
          api: 'account',
          uri: `cal/calendars/${calendarId}`,
          loading: 'account/calendar',
          tokenType: 'account',
        },
      });
    },
    async request({ rootState, commit, dispatch }, payload) {
      /** payload.options
       * uri, method, data, params, api, onSuccess, onError, loading
       */
      const { account } = rootState;
      const options = Object.assign({
        method: 'GET',
        api: 'meetings',
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

      if (options.loading) {
        commit({
          type: 'loading',
          flag: options.loading,
          loading: true,
        });
      }

      try {
        const response = await axios(requestOptions);
        return (options.onSuccess || Object)(response.data);
      } catch (error) {
        let message;
        let detail = null;
        if (error.response) {
          const { response } = error;
          if (response.headers['content-type'] === 'application/json') {
            message = response.data.message || response.statusText;
            // Only show error details when it's an API error.
            detail = JSON.stringify(response.data);
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
        await dispatch('setErrorMessage', {
          message: errorMessage,
          detail,
        });
        (options.onError || Object)(error);
        throw error;
      } finally {
        if (options.loading) {
          commit({
            type: 'loading',
            flag: options.loading,
            loading: false,
          });
        }
      }
    },
  },
};
