import Vue from 'vue';
import Router from 'vue-router';
import MeetingWindow from 'view/components/MeetingWindow';
import MeetingWindowDone from 'view/components/MeetingWindowDone';
import TimeSlots from 'view/components/TimeSlots';
import TimeSlotsDone from 'view/components/TimeSlotsDone';

Vue.use(Router);

export default new Router({
  mode: 'abstract',
  routes: [
    {
      path: '/meetingWindow/:id?',
      component: MeetingWindow,
    },
    {
      path: '/meetingWindowDone/',
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
