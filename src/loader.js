/* global VERSION, SCHEDULER_PATH, MESSAGE_PREFIX */
/**
 * loader script
 */
/* eslint-disable no-new, no-console */
import './loader.scss';

class MeetingScheduler {
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
      iframe: true,
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

    this.options = _options;

    if (_options.iframe) {
      const iframe = document.createElement('iframe');
      iframe.setAttribute(
        'class', 'kloudless-meeting-scheduler-iframe',
      );
      iframe.setAttribute('src', SCHEDULER_PATH);
      container.append(iframe);

      this.doms.iframe = iframe;
      this.messageEventHandler = this._onViewMessage.bind(this);
      window.addEventListener('message', this.messageEventHandler);
    } else {
      if (!MeetingScheduler.ViewClass) {
        console.error('Meeting Scheduler: does not provide view class');
        return this;
      }
      if (!this.view) {
        this.view = new MeetingScheduler.ViewClass();
      }
      this.view.launch(Object.assign({}, _options, { element: container }));
    }
    this.launched = true;
    return this;
  }

  // TODO: better message interface
  _onViewMessage(event) {
    const { data } = event;
    if (typeof data === 'object' && data.type.startsWith(MESSAGE_PREFIX)) {
      // process event
      const eventType = data.type.replace(MESSAGE_PREFIX, '');
      if (eventType === 'loaded') {
        const options = Object.assign(
          {},
          this.options,
          // element will be set inside iframe
          { element: null, events: null },
        );
        this.doms.iframe.contentWindow.postMessage({
          type: `${MESSAGE_PREFIX}launch`,
          payload: options,
        });
      }
    }
  }

  destroy() {
    if (this.launched) {
      // launch in iframe: elements will be removed after cleaning parentElement
      // only need to unregister message event
      if (this.options.iframe && this.messageEventHandler) {
        window.removeEventListener('message', this.messageEventHandler);
      // launch directly: call view's destroy()
      } else if (this.view) {
        this.view.destroy();
      }
      // empty the parent element
      this.doms.parentElement.innerHTML = '';
    }
  }
}

MeetingScheduler.setViewClass = function setViewClass(ViewClass) {
  this.ViewClass = ViewClass;
};

MeetingScheduler.version = VERSION;

export default MeetingScheduler;
