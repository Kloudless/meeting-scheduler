export const ROLES = {
  LOADER: 'LOADER',
  VIEW: 'VIEW',
};

// Do not change values in this map, because strings are used as public api
// e.g. devs will register events with scheduler.on('open', () => {...});
export const EVENTS = {
  OPEN: 'open',
  CLOSE: 'close',
  DESTROY: 'destroy',
  CONNECT_ACCOUNT: 'connectAccount',
  REMOVE_ACCOUNT: 'removeAccount',
  PRE_SUBMIT_MEETING_WINDOW: 'preSubmitMeetingWindow',
  SUBMIT_MEETING_WINDOW: 'submitMeetingWindow',
  DELETE_MEETING_WINDOW: 'deleteMeetingWindow',
  PRE_CONFIRM_SCHEDULE: 'preConfirmSchedule',
  CONFIRM_SCHEDULE: 'confirmSchedule',
  RESTART: 'restart',
  ERROR: 'error',
};

export const INTERNAL_EVENTS = {
  VIEW_LAUNCH: 'VIEW_LAUNCH',
  VIEW_LOAD: 'VIEW_LOAD',
};

export const EVENTS_LIST = Object.values(EVENTS);

export const SUBMIT_STATUS = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  DELETED: 'DELETED',
};

export default {
  EVENTS,
  EVENTS_LIST,
  INTERNAL_EVENTS,
  ROLES,
};
