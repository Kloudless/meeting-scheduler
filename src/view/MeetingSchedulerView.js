import './vue-setup';
import Vue from 'vue';
import router from 'view/router';
import App from 'view/components/App';
import { initStore } from 'view/store';
import { ROLES, INTERNAL_EVENTS } from 'constants';
import EventMessenger from 'event-messenger';

class MeetingSchedulerView {
  constructor(options) {
    this.id = options.id;
    this.messenger = new EventMessenger({
      id: options.id,
      category: ROLES.VIEW,
      onMessage: this.onMessage.bind(this),
    });

    this.store = initStore(this.messenger);
  }

  /**
   * Create the view object and render it on page
   * @param {Object} options - launch options, assume it is verified in loader
   */
  launch(options) {
    this.destroy();

    const dom = options.element;
    this.vm = new Vue({
      router,
      store: this.store,
      components: { App },
      template: '<App/>',
    });
    this.store.dispatch('initialize', { launchOptions: options });
    this.vm.$mount();
    dom.appendChild(this.vm.$el);
    return this;
  }

  onMessage(message) {
    switch (message.event) {
      case INTERNAL_EVENTS.VIEW_LAUNCH: {
        // remove loading icon in iframe page
        const loading = document.getElementById('loading');
        if (loading) {
          loading.remove();
        }
        this.launch(Object.assign(
          {},
          message.options,
          { element: document.getElementById('kloudless-meeting-scheduler') },
        ));
        break;
      }
      default:
    }
  }

  destroy() {
    if (this.vm) {
      this.vm.$destroy();
    }
  }
}

export default MeetingSchedulerView;
