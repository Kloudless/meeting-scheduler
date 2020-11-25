import Vue from 'vue';
import Router from 'vue-router';
import MeetingWindow from 'view/components/MeetingWindow';
import MeetingWindowCompletion from 'view/components/MeetingWindowCompletion';
import TimeSlots from 'view/components/TimeSlots';
import TimeSlotsCompletion from 'view/components/TimeSlotsCompletion';
import ViewScheduledEvent from 'view/components/ViewScheduledEvent';


Vue.use(Router);

export default new Router({
  mode: 'abstract',
  routes: [
    {
      path: '/meetingWindow/',
      component: MeetingWindow,
    },
    {
      path: '/meetingWindowCompletion/:action',
      component: MeetingWindowCompletion,
    },
    {
      path: '/timeSlots/:action',
      component: TimeSlots,
    },
    {
      path: '/timeSlotsCompletion/:action',
      component: TimeSlotsCompletion,
    },
    {
      path: '/viewScheduledEvent',
      component: ViewScheduledEvent,
    },
  ],
});
