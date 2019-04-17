/**
 * Small snippet to get launch options from the test page and
 * pass it to the Meeting Scheduler.
 * Bind the function to window so that it can be used in build test page.
 * Used in dev test page and build test pages
 */
function stringify(obj) {
  return JSON.stringify(obj, null, 2);
}

window.setupTestLaunch = function setupTestLaunch(MeetingScheduler, appId) {
  const options = document.getElementById('options');
  const scheduler = new MeetingScheduler();
  window.scheduler = scheduler;

  window.launchMeetingScheduler = () => {
    const launchOptions = JSON.parse(options.value);
    options.value = stringify(launchOptions);
    scheduler.launch(launchOptions);
  };

  // set default launch options
  let eventId = null;
  window.location.href.replace(
    /[?&]eventId=([a-zA-Z0-9]+)/,
    (match, p1) => {
      eventId = p1;
    },
  );

  const setupOption = {
    element: '#kloudless-meeting-scheduler',
    iframe: false,
  };

  if (eventId) {
    setupOption.eventId = eventId;
  } else {
    setupOption.eventUrlFormat = `${window.location.origin}/?eventId=EVENT_ID`;
    if (appId) {
      setupOption.appId = appId;
    }
  }
  options.value = stringify(setupOption);
};
