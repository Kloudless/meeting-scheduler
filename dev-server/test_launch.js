/**
 * Small snippet to get launch options from the test page and
 * pass it to the Meeting Scheduler.
 * Bind the function to window so that it can be used in build test page.
 * Used in dev test page and build test pages
 */
import { EVENTS_LIST } from 'constants';

function stringify(obj) {
  return JSON.stringify(obj, null, 2);
}

window.setupTestLaunch = function setupTestLaunch(MeetingScheduler, appId) {
  const options = document.getElementById('options');
  const schedulers = [new MeetingScheduler(), new MeetingScheduler()];
  schedulers.forEach((scheduler) => {
    EVENTS_LIST.forEach((event) => {
      scheduler.on(event, (eventData) => {
        /* eslint-disable no-console */
        console.log(
          'Scheduler', scheduler, 'received event', event,
          'with data', eventData,
        );
        /* eslint-enable */
      });
    });
  });

  window.schedulers = schedulers;

  window.launchMeetingScheduler = (index) => {
    const launchOptions = JSON.parse(options.value);
    options.value = stringify(launchOptions);
    launchOptions.element = `#kloudless-meeting-scheduler${index}`;
    schedulers[index].launch(launchOptions);
  };

  // set default launch options
  const params = MeetingScheduler.getQueryParams();

  const optionsInput = {
    mode: 'attach',
  };

  if (appId) {
    optionsInput.appId = appId;
  }

  if (params.meetingWindowId) {
    optionsInput.schedule = {
      meetingWindowId: params.meetingWindowId,
    };
  } else {
    optionsInput.setup = {
      scheduleUrl:
        `${window.location.origin}/?meetingWindowId=MEETING_WINDOW_ID`,
    };
  }
  options.value = stringify(optionsInput);
};
