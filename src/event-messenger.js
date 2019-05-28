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

import { ROLES } from 'constants';

/**
 * EventMessenger / Window instances map
 * id: {[role]: [instance]}
 */
const messengers = {};

function getOppositeRole(role) {
  return role === ROLES.LOADER
    ? ROLES.VIEW : ROLES.LOADER;
}

function throwError(errorMessage) {
  throw new Error(`Meeting Scheduler: ${errorMessage}`);
}

// export for unit test
export function processMessage(data) {
  if (
    typeof data === 'object' && data !== null && typeof data.event === 'string'
    && data.event.startsWith(MESSAGE_PREFIX)) {
    // process message data
    const { id, role, event } = data;
    if (!id) {
      throwError('Message should contain id');
    }

    if (!role) {
      throwError('Message should contain object role');
    }

    const messenger = messengers[id] ? messengers[id][role] : undefined;

    if (messenger && messenger.onMessage) {
      // Construct message sent to onMessage.
      // Extract event name and delete fields only used by EventMessenger
      const message = Object.assign({}, data);
      message.event = event.replace(MESSAGE_PREFIX, '');
      delete message.role;
      delete message.id;
      messenger.onMessage(message);
    } else {
      throwError(`Cannot find messenger for ${role} id ${id}`);
    }
  }
}

const origins = {};

export class EventMessenger {
  /**
   * @param {enum} targetRole ROLES.LOADER or ROLES.VIEW
   * @param {string} targetPath target window's path
   */
  static setTargetOrigin(targetRole, targetPath) {
    try {
      origins[targetRole] = new URL(targetPath).origin;
    } catch (exception) {
      /**
       * If targetPath cannot be parsed into a URL object, assume
       * it is a relative path or malformed.
       * We don't need to set origin in these cases
       */
      origins[targetRole] = undefined;
    }
  }

  /**
   *
   * id: scheduler id
   * role: object role that this messenger is bound to, should be
   *   a value from role enum
   * onMessage: message handler function when a message is received
   * iframe: optional iframe object, if specified, it will be save
   *  as a messenger of the opposite role.
   *  e.x. if objCategory=LOADER, this iframe will be saved as a VIEW messenger
   */
  constructor(options) {
    const {
      id,
      role,
      onMessage,
    } = options;
    if (typeof messengers[id] === 'undefined') {
      messengers[id] = {};
    }
    this.role = role;
    this.onMessage = onMessage;
    this.id = id;
  }

  /**
   * Send message to receiver
   * @param {Object} data
   *   should contain `event` key
   * @param {string} targetOrigin
   *   override targetOrigin, used by view to send initial event
   */
  send(data, targetOrigin = undefined) {
    const { id } = this;
    const receiverRole = getOppositeRole(this.role);
    const message = { ...data, id, role: receiverRole };
    // attach message prefix;
    message.event = `${MESSAGE_PREFIX}${message.event}`;
    const receiver = messengers[id][receiverRole];

    // receiver instanceof Window does not work in chrome
    if (receiver && typeof receiver.postMessage === 'function') {
      receiver.postMessage(message, targetOrigin || origins[receiverRole]);
    } else {
      throwError(`Cannot find EventMessenger for ${receiverRole} id ${id}`);
    }
  }

  /**
   * Register messenger and receiver into messengers map
   * @param {Window} receiver
   */
  connect(receiver) {
    const { id, role } = this;
    messengers[id] = {
      [role]: this,
      [getOppositeRole(role)]: receiver,
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
  processMessage(event.data);
});

export default EventMessenger;
