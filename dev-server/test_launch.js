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
  const schedulers = [new MeetingScheduler(), new MeetingScheduler()];
  window.schedulers = schedulers;

  window.launchMeetingScheduler = (index) => {
    const launchOptions = JSON.parse(options.value);
    options.value = stringify(launchOptions);
    launchOptions.element = `#kloudless-meeting-scheduler${index}`;
    schedulers[index].launch(launchOptions);
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
    mode: 'attach',
  };

  if (eventId) {
    setupOption.eventId = eventId;
  } else {
    setupOption.eventUrlFormat = `${window.location.origin}/?eventId=EVENT_ID`;
    if (appId) {
      // appId is supplied, this is loaded in a dev environment
      setupOption.appId = appId;
      // launch the view in the same page so that we could use Vue dev-tool
      setupOption.iframe = false;
    }
  }
  options.value = stringify(setupOption);
};
