/* global VERSION, BASE_URL, SCHEDULER_PATH */
/**
 * loader script
 */
/* eslint-disable no-console */
import './loader.scss';
import { CATEGORY, EventMessenger } from './event-messenger';

let schedulerId = 0;

const globalOptions = {
  baseUrl: BASE_URL,
  schedulerPath: SCHEDULER_PATH,
};
EventMessenger.setSchedulerOrigin(globalOptions.schedulerPath);

class MeetingScheduler {
  constructor() {
    schedulerId += 1;
    this.id = schedulerId;

    this.doms = {};
    this.options = {};
    this.launched = false;
    this.messenger = new EventMessenger({
      id: this.id,
      category: CATEGORY.LOADER,
      onMessage: this.onMessage.bind(this),
    });
  }

  /**
   * Launch Meeting Scheduler
   * @param {Object} options - launch options
   * see README for available options
   */
  launch(options) {
    this.destroy();

    this.doms = {};

    const _options = Object.assign({
      mode: 'modal',
    }, options);

    if (!_options.appId && !_options.eventId) {
      console.error('Meeting Scheduler: appId or eventId is required.');
      return this;
    }

    if (_options.mode !== 'modal' && _options.mode !== 'attach') {
      _options.mode = 'modal';
    }


    let parentElement;
    if (_options.mode === 'attach') {
      if (_options.element instanceof Element) {
        parentElement = _options.element;
      } else {
        parentElement = document.querySelector(_options.element);
      }
      // cannot launch attach mode
      // if options.element does not match any DOM Element
      if (!parentElement) {
        console.error('Meeting Scheduler: element option is missing or it ' +
          'does not match any DOM element');
        return this;
      }
    } else {
      // for modal mode, ignore element option
      parentElement = document.getElementById('kloudless-meeting-scheduler');
      if (!parentElement) {
        // create and append an empty div at the end of body
        // if the element does not exist yet
        parentElement = document.createElement('div');
        parentElement.setAttribute('id', 'kloudless-meeting-scheduler');
        document.body.appendChild(parentElement);
      }
    }

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
      case 'iframe-loaded': {
        this.messenger.send({
          event: 'iframe-launch-view',
          options: Object.assign(
            {},
            this.options,
            // element will be set inside iframe
            { element: null },
          ),
        });
        return;
      }
      case 'close': {
        this.destroy();
        break;
      }
      default:
        break;
    }
    // TODO: invoke event callbacks
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

  static setOptions(options) {
    if (typeof options === 'object') {
      Object.keys(globalOptions).forEach((name) => {
        if (typeof options[name] !== 'undefined' && options[name] !== null) {
          globalOptions[name] = options[name];
          if (name === 'schedulerPath') {
            EventMessenger.setSchedulerOrigin(globalOptions.schedulerPath);
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
