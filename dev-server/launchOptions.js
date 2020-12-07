const BASE = {
  mode: 'modal',
  appId: '',
};

export const SETUP = {
  ...BASE,
  setup: {
    scheduleUrl: 'http://localhost:8080/?meetingWindowId=MEETING_WINDOW_ID',
    formOptions: {
      title: {
        default: 'test title',
      },
      description: {
        default: 'test description',
      },
      location: {
        default: 'test location',
      },
      duration: {
        default: 60,
      },
      organizer: {
        default: 'shirley',
      },
      weekday: {
        default: [
          'MON',
          'TUE',
          'FRI',
        ],
      },
      startHour: {
        default: '12:00:00',
      },
      endHour: {
        default: '14:00:00',
      },
      timeSlotInterval: {
        default: 60,
      },
      availabilityRange: {
        default: 60,
      },
      timeBufferBefore: {
        default: 30,
      },
      timeBufferAfter: {
        default: 10,
      },
      allowEventMetadata: true,
    },
  },
};

export const SCHEDULE = {
  ...BASE,
  schedule: {
    rescheduleUrl: 'http://localhost:8080/?scheduledEventId=SCHEDULED_EVENT_ID',
    meetingWindowId: '',
    formOptions: {
      extraDescription: {
        default: 'put your note here',
        visible: true,
      },
    },
  },
};
