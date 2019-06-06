import Vue from 'vue';
import Router from 'vue-router';
import MeetingWindow from 'view/components/MeetingWindow';
import MeetingWindowCompletion from 'view/components/MeetingWindowCompletion';
import MeetingWindowDeletion from 'view/components/MeetingWindowDeletion';
import TimeSlots from 'view/components/TimeSlots';
import TimeSlotsCompletion from 'view/components/TimeSlotsCompletion';

Vue.use(Router);

export default new Router({
  mode: 'abstract',
  routes: [
    {
      path: '/meetingWindow/',
      component: MeetingWindow,
    },
    {
      path: '/meetingWindowCompletion/:submitStatus',
      component: MeetingWindowCompletion,
    },
    {
      path: '/meetingWindowDeletion/',
      component: MeetingWindowDeletion,
    },
    {
      path: '/timeSlots/',
      component: TimeSlots,
    },
    {
      path: '/timeSlotsCompletion/',
      component: TimeSlotsCompletion,
    },
  ],
});
