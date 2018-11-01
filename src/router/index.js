import Vue from 'vue';
import Router from 'vue-router';
import MeetingWindow from 'components/MeetingWindow';
import MeetingWindowDone from 'components/MeetingWindowDone';
import TimeSlots from 'components/TimeSlots';
import TimeSlotsDone from 'components/TimeSlotsDone';

Vue.use(Router);

export default new Router({
  mode: 'abstract',
  routes: [
    {
      path: '/meetingWindow/:id?',
      component: MeetingWindow,
    },
    {
      path: '/meetingWindowDone/:eventId',
      component: MeetingWindowDone,
    },
    {
      path: '/timeSlots/',
      component: TimeSlots,
    },
    {
      path: '/timeSlotsDone/',
      component: TimeSlotsDone,
    },
  ],
});
