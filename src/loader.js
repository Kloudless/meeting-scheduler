/* global VERSION, BASE_URL, SCHEDULE_URL, SCHEDULER_PATH */
/**
 * loader script
 */
/* eslint-disable no-console, class-methods-use-this */
import './loader.scss';
import EventMessenger from 'event-messenger';
import {
  ROLES,
  EVENTS,
  EVENTS_LIST,
  INTERNAL_EVENTS,
} from './constants';

let schedulerId = 0;

const globalOptions = {
  baseUrl: BASE_URL,
  schedulerPath: SCHEDULER_PATH,
};
EventMessenger.setTargetOrigin(ROLES.VIEW, globalOptions.schedulerPath);

class MeetingScheduler {
  constructor() {
    schedulerId += 1;
    this.id = schedulerId;

    this.doms = {};
    this.options = {};
    this.launched = false;
    this.messenger = new EventMessenger({
      id: this.id,
      role: ROLES.LOADER,
      onMessage: this.onMessage.bind(this),
    });
    this.events = {};
  }

  log(message, level = 'error') {
    console[level](`Meeting Scheduler: ${message}`);
  }

  _applyDefaultOptions(options) {
    const _options = Object.assign({
      mode: 'modal',
    }, options);

    if (_options.mode !== 'modal' && _options.mode !== 'attach') {
      _options.mode = 'modal';
    }

    if (_options.mode === 'attach') {
      if (!(_options.element instanceof HTMLElement)) {
        _options.element = document.querySelector(_options.element);
      }
    } else {
      // for modal mode, ignore element option
      let parentElement
        = document.getElementById('kloudless-meeting-scheduler');
      if (!parentElement) {
        // create and append an empty div at the end of body
        // if the element does not exist yet
        parentElement = document.createElement('div');
        parentElement.setAttribute('id', 'kloudless-meeting-scheduler');
        document.body.appendChild(parentElement);
      }
      _options.element = parentElement;
    }

    if (_options.setup && !_options.setup.scheduleUrl) {
      _options.setup.scheduleUrl = SCHEDULE_URL;
    }

    if (_options.setup) {
      _options.setup.afterSubmit = {
        showResult: true,
        actions: ['close'],
        ..._options.setup.afterSubmit,
      };
    } else if (_options.schedule) {
      _options.schedule.afterSchedule = {
        showResult: true,
        actions: ['close'],
        ..._options.schedule.afterSchedule,
      };
    }

    return _options;
  }

  // convert v1.1 option format to current one
  _convertOptions(options) {
    if (options.eventUrlFormat && !options.setup) {
      options.setup = {
        scheduleUrl: (options.eventUrlFormat || '').replace(
          'EVENT_ID', 'MEETING_WINDOW_ID',
        ),
      };
      delete options.eventUrlFormat;
    }
    if (options.eventId && !options.schedule) {
      options.schedule = {
        meetingWindowId: options.eventId,
      };
      delete options.eventId;
    }
  }


  /**
   * Verify if the launch options are valid
   * @param {Object} options - launch options
   * Return value:
   *   {
   *     valid: true if options are valid, false otherwise
   *     errors: a list of error, only provided when the input is not valid
   *     warns: a list of warnings in the config
   *   }
   */
  _verifyOptions(options) {
    const errors = [];
    const warns = [];
    const { appId, setup, schedule } = options;

    // TODO: enhance options check for any new feature
    if (!setup && !schedule) {
      errors.push(
        'One of the following keys is required: setup or schedule.',
      );
    } else if (setup && schedule) {
      errors.push(
        'Cannot use both setup and schedule within the same config.',
      );
    }
    if (setup && !appId) {
      errors.push('appId is required for the setup view.');
    } else if (!appId) {
      warns.push(
        'appId is not provided. No callbacks will receive sensitive'
        + ' data because the widget could not verify if the current domain'
        + ' is trusted',
      );
    }
    if (setup && setup.meetingWindowId && !setup.accountToken) {
      errors.push('accountToken is required to edit meeting window');
    }
    if (schedule && !schedule.meetingWindowId) {
      errors.push('meetingWindowId is required for schedule view.');
    }
    if (!(options.element instanceof HTMLElement)) {
      errors.push(
        'element option is missing or does not match any HTML element',
      );
    }
    const result = {
      valid: errors.length === 0,
      errors,
      warns,
    };
    return result;
  }

  config(options) {
    if (this.launched) {
      this.log('You cannot change options after widget is launched');
      return false;
    }
    const _options = this._applyDefaultOptions(options);
    this._convertOptions(_options);
    const result = this._verifyOptions(_options);
    result.warns.forEach((warn) => { this.log(warn, 'warn'); });
    if (result.valid) {
      this.options = _options;
      return true;
    }
    result.errors.forEach((error) => { this.log(error, 'error'); });
    return false;
  }

  /**
   * Launch Meeting Scheduler
   * @param {Object} options - launch options
   * see README for available options
   */
  launch(options) {
    if (this.launched) {
      this.destroy();
    }

    if (!this.options) {
      this.log('options were not specified or pre-configured.');
      return this;
    }

    if (options) {
      if (!this.config(options)) {
        return this;
      }
    }

    this.doms = {};

    const _options = this.options;
    const parentElement = _options.element;

    // empty the parent
    parentElement.innerHTML = '';
    this.doms.parentElement = parentElement;

    const container = document.createElement('div');
    container.setAttribute(
      'class', 'kloudless-meeting-scheduler-container',
    );

    // insert elements for modal view
    if (_options.mode === 'modal') {
      const modal = document.createElement('div');
      modal.setAttribute(
        'class', 'kloudless-meeting-scheduler-modal',
      );
      const overlay = document.createElement('div');
      overlay.setAttribute(
        'class', 'kloudless-meeting-scheduler-modal-overlay',
      );
      modal.appendChild(overlay);
      modal.appendChild(container);
      parentElement.append(modal);
      // launch the view inside modal
    } else {
      parentElement.append(container);
    }

    this.doms.container = container;
    this.options = _options;

    const iframe = document.createElement('iframe');
    iframe.setAttribute(
      'class', 'kloudless-meeting-scheduler-iframe',
    );
    iframe.setAttribute('src', `${globalOptions.schedulerPath}#${this.id}`);
    container.append(iframe);

    this.doms.iframe = iframe;
    this.messenger.connect(iframe.contentWindow);
    window.addEventListener('message', this.messageEventHandler);
    this.launched = true;
    return this;
  }

  /**
   * @param {Object} message
   * Message object containing the following keys:
   *  type: Represent vuex action type
   *  event: event name
   *  ...eventData: the rest of the keys will be treated as event data and
   *  send to the callback, except 'scheduler'
   * }
   */
  onMessage(message) {
    /* eslint-disable no-unused-vars */
    const {
      type,
      event,
      // 'scheduler' is reserved for attaching scheduler instance
      scheduler,
      ...eventData
    } = message;
    /* eslint-enable */
    switch (event) {
      case INTERNAL_EVENTS.VIEW_LOAD: {
        this.messenger.send({
          event: INTERNAL_EVENTS.VIEW_LAUNCH,
          options: {
            ...this.options,
            globalOptions,
            // element will be set inside the view
            element: null,
            targetPath: window.location.href,
          },
        });
        return;
      }
      case EVENTS.CLOSE: {
        this.destroy();
        break;
      }
      default:
        break;
    }
    (this.events[event] || []).forEach((callback) => {
      callback({ scheduler: this, ...eventData });
    });
  }

  destroy() {
    if (this.launched) {
      // empty the parent element
      // if the view is launched in iframe, it will be removed as well
      this.doms.parentElement.innerHTML = '';
      this.launched = false;
      this.onMessage({ event: 'destroy' });
      this.messenger.disconnect();
    }
  }

  on(eventName, callback) {
    if (!EVENTS_LIST.includes(eventName)) {
      return;
    }
    if (typeof callback === 'function') {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
    }
  }

  off(eventName, callback) {
    if (typeof callback === 'undefined') {
      delete this.events[eventName];
    } else {
      this.events[eventName] = this.events[eventName].filter(
        c => c !== callback,
      );
    }
  }

  /**
   * A utility to parse query params into an object map
   */
  static getQueryParams() {
    const url = window.location.href;
    const params = {};
    url.replace(/[?&]([^?&=]+)=([^?&=]+)/g, (match, p1, p2) => {
      params[p1] = p2;
    });
    return params;
  }

  static setOptions(options) {
    if (typeof options === 'object') {
      Object.keys(globalOptions).forEach((name) => {
        if (typeof options[name] !== 'undefined' && options[name] !== null) {
          globalOptions[name] = options[name];
          if (name === 'schedulerPath') {
            EventMessenger.setTargetOrigin(
              ROLES.VIEW,
              globalOptions.schedulerPath,
            );
          }
        }
      });
    }
  }

  static getOptions() {
    // do not return original instance
    return { ...globalOptions };
  }
}

MeetingScheduler.version = VERSION;

export default MeetingScheduler;
