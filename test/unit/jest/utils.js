import { CATEGORY, EventMessenger } from 'event-messenger';

/**
 * Modified from deepMerge() in axios/lib/utils.js, but also handle Arrays.
 * Similar to Object.assign but will recursively do merges for objects under
 * objects as well.
 * Also, when copying objects, new reference is always created even if there
 * is no merge required.
 */
export function deepMerge(...objs) {
  const result = {};
  objs.forEach((obj) => {
    if (obj === null || typeof obj !== 'object') {
      return;
    }
    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      if (val instanceof Array) {
        result[key] = [...val];
      } else if (typeof result[key] === 'object' && typeof val === 'object') {
        result[key] = deepMerge(result[key], val);
      } else if (typeof val === 'object') {
        result[key] = deepMerge({}, val);
      } else {
        result[key] = val;
      }
    });
  });
  return result;
}

export function createMessenger() {
  const messenger = new EventMessenger({
    id: 0,
    category: CATEGORY.VIEW,
    onMessage: jest.fn(),
  });
  // by default do not send messages
  messenger.send = jest.fn();
  return messenger;
}
