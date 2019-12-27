/* eslint-disable import/prefer-default-export */

export const SETUP_FORM_OPTIONS = {
  title: { default: 'title', visible: false },
  location: { default: 'location', visible: false },
  description: { default: 'description', visible: false },
  duration: { default: 30, visible: false },
  timeZone: { default: 'Asia/Tokyo', visible: false },
  weekday: { default: ['MON', 'WED', 'FRI'], visible: false },
  startHour: { default: '12:00:00', visible: false },
  endHour: { default: '13:00:00', visible: false },
  timeBufferBefore: { default: 5, visible: false },
  timeBufferAfter: { default: 10, visible: false },
  availabilityRange: { default: 15, visible: false },
  timeSlotInterval: { default: 15, visible: false },
  organizer: { default: 'shirley@kloudless.com', visible: false },
  bookingCalendarId: { default: 'primary', visible: false },
  allowEventMetadata: { default: true },
  defaultEventMetadata: { default: { transparent: true } },
};

export const SCHEDULE_FORM_OPTIONS = {
  name: { default: 'andy', visible: false },
  email: { default: 'andy@kloudless.com', visible: false },
};
