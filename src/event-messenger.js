/* global MESSAGE_PREFIX */
/**
 * Message interface between loader and the view
 *
 * Message format:
 * messenger.send({
 *   event: {event name}
 *   [key]:[value]
 * });
 * Message data should always be a valid JSON
 */

const CATEGORY = { LOADER: 'loader', VIEW: 'view' };

/**
 * EventMessenger / Window instances map
 * id: {[category]: [instance]}
 */
const messengers = {};

function getOppositeCategory(category) {
  return category === CATEGORY.LOADER ? CATEGORY.VIEW : CATEGORY.LOADER;
}

function throwError(errorMessage) {
  throw new Error(`Meeting Scheduler: ${errorMessage}`);
}

function processMessage(data) {
  if (typeof data === 'object' && typeof data.event === 'string' &&
    data.event.startsWith(MESSAGE_PREFIX)) {
    // process message data
    const { id, category, event } = data;
    if (!id) {
      throwError('Message should contain id');
    }

    const messenger = messengers[id][category];

    if (messenger.onMessage) {
      // Construct message sent to onMessage.
      // Extract event name and delete fields only used by EventMessenger
      const message = Object.assign({}, data);
      message.event = event.replace(MESSAGE_PREFIX, '');
      delete message.category;
      delete message.id;
      messenger.onMessage(message);
    } else {
      throwError(`Cannot find messenger for ${category} id ${id}`);
    }
  }
}

// record the host of the scheduler view page for postMessage origin argument.
let schedulerPathOrigin;

class EventMessenger {
  static setSchedulerOrigin(schedulerPath) {
    try {
      schedulerPathOrigin = new URL(schedulerPath).origin;
    } catch (exception) {
      /**
       * If schedulerPath cannot be parsed into a URL object, assume
       * it is a relative path or malformed.
       * We don't need to set origin in these cases
       */
      schedulerPathOrigin = undefined;
    }
  }

  /**
   *
   * id: scheduler id
   * category: object category that this messenger is bound to, should be
   *   a value from category enum
   * onMessage: message handler function when a message is received
   * iframe: optional iframe object, if specified, it will be save
   *  as a messenger of the opposite category.
   *  e.x. if objCategory=LOADER, this iframe will be saved as a VIEW messenger
   */
  constructor(options) {
    const {
      id,
      category,
      onMessage,
    } = options;
    if (typeof messengers[id] === 'undefined') {
      messengers[id] = {};
    }
    this.category = category;
    this.onMessage = onMessage;
    this.id = id;
  }

  /**
   * Send message to receiver
   * @param {Object} data
   *   should contain `event` key
   */
  send(data) {
    const { id } = this;
    const receiverCategory = getOppositeCategory(this.category);
    const message = { ...data, id, category: receiverCategory };
    // attach message prefix;
    message.event = `${MESSAGE_PREFIX}${message.event}`;
    const receiver = messengers[id][receiverCategory];

    // receiver instanceof Window does not work in chrome
    if (receiver && typeof receiver.postMessage === 'function') {
      // if receiver is a window, use postMessage
      let origin;
      if (receiverCategory === CATEGORY.VIEW) {
        origin = schedulerPathOrigin;
      } else {
        /** Posting to parent frame (where loader locates),
         * assume parent is trusted since the view can only be
         * launched by a loader
         */
        origin = '*';
      }
      receiver.postMessage(message, origin);
    } else {
      throwError(`Cannot find EventMessenger for ${receiverCategory} id ${id}`);
    }
  }

  /**
   * Register messenger and receiver into messengers map
   * @param {Window} receiver
   */
  connect(receiver) {
    const { id, category } = this;
    messengers[id] = {
      [category]: this,
      [getOppositeCategory(category)]: receiver,
    };
  }

  /**
   * Remove messenger and receiver from messengers map, used for destroy
   */
  disconnect() {
    const { id } = this;
    if (!messengers[id]) {
      return;
    }
    delete messengers[id];
  }
}

window.addEventListener('message', (event) => {
  processMessage(event.data, origin);
});

export { CATEGORY, EventMessenger };
