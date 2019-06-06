import devtools from '@vue/devtools';
import MeetingSchedulerView from 'view/MeetingSchedulerView';
import { INTERNAL_EVENTS } from 'constants';

/**
 * @vue/devtools will be replace with an empty module by webpack null-loader for
 * production build.
 */
if (devtools && devtools.connect) {
  devtools.connect('localhost', 8098);
}

if (window.parent !== window) {
  // only execute this script when launched inside iframe
  const id = window.location.hash.substr(1);
  setTimeout(() => {
    const scheduler = new MeetingSchedulerView({
      id,
    });

    scheduler.messenger.connect(window.parent);
    scheduler.messenger.send({
      event: INTERNAL_EVENTS.VIEW_LOAD,
    }, '*');
  }, 0);
}
