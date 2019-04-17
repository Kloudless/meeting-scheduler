/* global KLOUDLESS_APP_ID */
import MeetingScheduler from 'loader';
import MeetingSchedulerView from 'view/MeetingSchedulerView';
import './test_launch';

MeetingScheduler.setViewClass(MeetingSchedulerView);

window.setupTestLaunch(MeetingScheduler, KLOUDLESS_APP_ID);
