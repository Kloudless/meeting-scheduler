/* global VERSION, BASE_URL, SCHEDULE_URL, SCHEDULER_PATH */
/**
 * loader script
 */
/* eslint-disable no-console, class-methods-use-this */
import './loader.less';
import EventMessenger from 'event-messenger';
import {
  ROLES,
  EVENTS,
  EVENTS_LIST,
  INTERNAL_EVENTS,
} from './constants';
import { inRangeOf } from './view/utils/form_validator';
import {
  DURATIONS, TIME_ZONES, TIME_SLOT_INTERVALS, HOURS, WEEKDAYS,
} from './view/utils/fixtures';

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
    this.options = null;

    this.messenger = new EventMessenger({
      id: this.id,
      role: ROLES.LOADER,
      onMessage: this.onMessage.bind(this),
    });
    this.events = {};
    this.viewContainer = null;

    // flags to control if iframe should be displayed
    this._launched = false;
    this._viewLoaded = false;
  }

  log(message, level = 'error') {
    console[level](`Meeting Scheduler: ${message}`);
  }

  _hasKey(formOptions, key) {
    return field => (
      formOptions[field] && formOptions[field][key] !== undefined
      && formOptions[field][key] !== null
    );
  }

  _verifyScheduleFormOptions(formOptions) {
    const errors = [];
    const prefix = 'schedule.formOptions.';
    ['name', 'email']
      .filter(this._hasKey(formOptions, 'visible'))
      .forEach((field) => {
        const { [field]: { visible, default: value } } = formOptions;
        if (visible === false && !value) {
          errors.push(
            `${prefix}${field}.default cannot be empty if ` +
            `${prefix}${field}.visible is false.`,
          );
        }
      });
    // check text field
    ['name', 'email', 'extraDescription']
      .filter(this._hasKey(formOptions, 'default'))
      .forEach((field) => {
        const { [field]: { default: value } } = formOptions;
        if (typeof value !== 'string') {
          errors.push(`${prefix}${field}: should be string.`);
        }
      });
    return errors;
  }

  _verifySetupFormOptions(formOptions, accountToken) {
    const errors = [];
    const prefix = 'setup.formOptions.';
    ['title', 'organizer', 'bookingCalendarId']
      .filter(this._hasKey(formOptions, 'visible'))
      .forEach((field) => {
        const { [field]: { visible, default: value } } = formOptions;
        if (visible === false && !value) {
          errors.push(
            `${prefix}${field}.default cannot be empty if ` +
            `${prefix}${field}.visible is false.`,
          );
        }
      });

    if (this._hasKey(formOptions, 'default')('bookingCalendarId')) {
      if (formOptions.bookingCalendarId.default && !accountToken) {
        errors.push(
          `${prefix}bookingCalendarId.default requires setup.accountToken ` +
          'to be set.',
        );
      }
    }

    // check text field
    ['title', 'location', 'description', 'organizer']
      .filter(this._hasKey(formOptions, 'default'))
      .forEach((field) => {
        const { [field]: { default: value } } = formOptions;
        if (typeof value !== 'string') {
          errors.push(`${prefix}${field}: should be string.`);
        }
      });

    // check boolean field
    ['allowEventMetadata']
      .filter(this._hasKey(formOptions, 'default'))
      .forEach((field) => {
        const { [field]: { default: value } } = formOptions;
        if (typeof value !== 'boolean') {
          errors.push(`${prefix}${field}: should be boolean.`);
        }
      });
    // check JSON field
    ['defaultEventMetadata']
      .filter(this._hasKey(formOptions, 'default'))
      .forEach((field) => {
        const { [field]: { default: value } } = formOptions;
        try {
          if (typeof value !== 'object') {
            throw new Error();
          }
          JSON.stringify(value);
        } catch (e) {
          errors.push(
            `setup.formOptions.${field}: should be valid JSON object.`,
          );
        }
      });
    // check options: [<field>, <options>]
    [
      ['duration', DURATIONS],
      ['timeSlotInterval', TIME_SLOT_INTERVALS],
      ['timeZone', TIME_ZONES],
      // startHour cannot be the last one.
      ['startHour', HOURS.slice(0, HOURS.length - 1)],
      // endHour cannot be the first one.
      ['endHour', HOURS.slice(1)],
    ].filter(([field]) => this._hasKey(formOptions, 'default')(field))
      .forEach(([field, options]) => {
        const { [field]: { default: value } } = formOptions;
        if (!options.some(o => o.value === value)) {
          errors.push(`${prefix}${field}: invalid value.`);
        }
      });

    // check startHour and endHour
    if (this._hasKey(formOptions, 'default')('startHour')
        && this._hasKey(formOptions, 'default')('endHour')) {
      const startHour = formOptions.startHour.default;
      const endHour = formOptions.endHour.default;
      const startHourIndex = HOURS.findIndex(h => h.value === startHour);
      const endHourIndex = HOURS.findIndex(h => h.value === endHour);
      if (startHourIndex >= endHourIndex) {
        errors.push(`${prefix}startHour should before ${prefix}endHour`);
      }
    }

    // check number field: [<field>, <min>, <max>]
    [
      ['timeBufferBefore', 0, 99],
      ['timeBufferAfter', 0, 99],
      ['availabilityRange', 1, 90],
    ].filter(([field]) => this._hasKey(formOptions, 'default')(field))
      .forEach(([field, min, max]) => {
        const { [field]: { default: value } } = formOptions;
        if (!Number.isInteger(value) || inRangeOf(min, max)(value) !== true) {
          errors.push(`${prefix}${field}: should be number. (${min}–${max})`);
        }
      });

    // check weekday
    if (this._hasKey(formOptions, 'default')('weekday')) {
      const { weekday: { default: values } } = formOptions;
      if (!Array.isArray(values)
          || !values.every(v => WEEKDAYS.some(o => o.value === v))) {
        errors.push('setup.formOptions.weekday: should be array.');
      }
    }
    return errors;
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
        = document.getElementById(`kloudless-meeting-scheduler-${this.id}`);
      if (!parentElement) {
        // create and append an empty div at the end of body
        // if the element does not exist yet
        parentElement = document.createElement('div');
        parentElement.setAttribute(
          'id', `kloudless-meeting-scheduler-${this.id}`,
        );
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

      _options.setup.authOptions = {
        scope: 'calendar:normal',
        ..._options.setup.authOptions,
      };

      const { formOptions } = _options.setup;
      if (typeof formOptions === 'object' && formOptions !== null) {
        /**
         * Wrap values for non-editable fields into { key: {default: value} }
         * format so that they can be processed the same way as other
         * editable fields.
         */
        const { defaultEventMetadata, allowEventMetadata } = formOptions;
        if (defaultEventMetadata !== undefined) {
          formOptions.defaultEventMetadata = {
            default: defaultEventMetadata,
          };
        }
        if (
          allowEventMetadata !== undefined && allowEventMetadata !== null && !(
            // b/c compatible with old option format, which already uses
            // { default: value }
            typeof allowEventMetadata === 'object'
            && allowEventMetadata.default !== undefined
          )
        ) {
          formOptions.allowEventMetadata = {
            default: allowEventMetadata,
          };
        }
      }
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
    const {
      appId,
      setup,
      schedule,
      customStyleVars,
    } = options;

    if (typeof customStyleVars !== 'undefined' && (
      customStyleVars === null || typeof customStyleVars !== 'object')) {
      errors.push('customStyleVars must be an object.');
    }

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
    if (setup && setup.formOptions) {
      errors.push(
        ...this._verifySetupFormOptions(setup.formOptions, setup.accountToken),
      );
    }
    if (schedule && schedule.formOptions) {
      errors.push(
        ...this._verifyScheduleFormOptions(schedule.formOptions),
      );
    }
    const result = {
      valid: errors.length === 0,
      errors,
      warns,
    };
    return result;
  }

  _createContainer() {
    this._removeContainer();

    const _options = this.options;

    const parentElement = _options.element;

    const viewContainer = document.createElement('div');
    viewContainer.setAttribute(
      'class', 'kloudless-meeting-scheduler',
    );
    viewContainer.setAttribute('style', 'display:none');

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
      viewContainer.append(modal);
      // launch the view inside modal
    } else {
      viewContainer.append(container);
    }
    parentElement.appendChild(viewContainer);

    this.viewContainer = viewContainer;

    const iframe = document.createElement('iframe');

    iframe.setAttribute(
      'class', 'kloudless-meeting-scheduler-iframe',
    );
    iframe.setAttribute('src', `${globalOptions.schedulerPath}#${this.id}`);
    container.append(iframe);
    this.messenger.connect(iframe.contentWindow);
  }

  config(options) {
    const _options = this._applyDefaultOptions(options);
    this._convertOptions(_options);
    const result = this._verifyOptions(_options);
    result.warns.forEach((warn) => { this.log(warn, 'warn'); });
    if (result.valid) {
      const shouldCreateContainer =
        (!this.options || (this.options.mode !== _options.mode));
      this.options = _options;
      if (shouldCreateContainer) {
        if (this._launched) {
          // must destroy current view before creating a new one
          this.destroy();
        }
        this._createContainer();
      }
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
    if (options) {
      if (!this.config(options)) {
        return this;
      }
    }

    if (!this.options) {
      this.log('options were not specified or pre-configured.');
      return this;
    }

    if (!this.viewContainer) {
      /** This condition is satisfied when destroy() is called, then
       * launch() without options is called, and there is no config() call in
       * between
       */
      this._createContainer();
    }

    this._launched = true;
    this.viewContainer.setAttribute('style', '');
    this._launchView();
    return this;
  }

  _launchView() {
    // Only launch the view when view is full loaded and launch() is called
    if (this._launched && this._viewLoaded) {
      if (this.options.mode === 'modal') {
        document.body.classList.add('no-scroll');
      }
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
    }
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
        this._viewLoaded = true;
        this._launchView();
        return undefined;
      }
      case EVENTS.CLOSE: {
        this.destroy();
        break;
      }
      default:
        break;
    }

    let response;
    (this.events[event] || []).forEach((callback) => {
      response = callback({ scheduler: this, ...eventData });
    });
    return response;
  }

  _removeContainer() {
    if (this.viewContainer) {
      this.messenger.disconnect();
      this.viewContainer.remove();
      this.viewContainer = null;
      this._viewLoaded = false;
    }
  }

  destroy() {
    document.body.classList.remove('no-scroll');

    this._removeContainer();
    if (this._launched) {
      this.onMessage({ event: 'destroy' });
      this._launched = false;
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
