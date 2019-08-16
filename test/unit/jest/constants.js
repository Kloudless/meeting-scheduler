/* eslint-disable import/prefer-default-export */

export const SETUP_FORM_OPTIONS = {
  title: { default: 'title' },
  location: { default: 'location' },
  description: { default: 'description' },
  duration: { default: 30 },
  timeZone: { default: 'Asia/Tokyo' },
  weekday: { default: ['MON', 'WED', 'FRI'] },
  startHour: { default: '12:00:00' },
  endHour: { default: '13:00:00' },
  timeBufferBefore: { default: 5 },
  timeBufferAfter: { default: 10 },
  availabilityRange: { default: 15 },
  timeSlotInterval: { default: 15 },
  organizer: { default: 'shirley@kloudless.com' },
  allowEventMetadata: { default: true },
};

export const SCHEDULE_FORM_OPTIONS = {
  name: { default: 'andy' },
  email: { default: 'andy@kloudless.com' },
};
