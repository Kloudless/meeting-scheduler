/* global MESSAGE_PREFIX */
import MeetingSchedulerView from 'view/MeetingSchedulerView';

setTimeout(() => {
  document.getElementById('loading').remove();

  const scheduler = new MeetingSchedulerView();

  // TODO: better message interface
  window.addEventListener('message', (event) => {
    const { data } = event;
    if (typeof data === 'object' && data.type.startsWith(MESSAGE_PREFIX)) {
      // process event
      const eventType = data.type.replace(MESSAGE_PREFIX, '');
      if (eventType === 'launch') {
        const options = Object.assign(data.payload, {
          element: document.getElementById('kloudless-meeting-scheduler'),
        });
        scheduler.launch(options);
      }
    }
  });
  if (window.parent !== window) {
    // only send this when embedded
    window.parent.postMessage({
      type: `${MESSAGE_PREFIX}loaded`,
    });
  }
}, 100);
