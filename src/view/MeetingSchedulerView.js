import './vue-setup';

import Vue from 'vue';
import router from 'view/router';

import App from 'view/components/App';
import './less/index.less';

import { initStore } from 'view/store';
import { ROLES, INTERNAL_EVENTS } from 'constants';
import EventMessenger from 'event-messenger';
import buildCustomStyle from './custom-style';

class MeetingSchedulerView {
  constructor(options) {
    this.id = options.id;
    this.messenger = new EventMessenger({
      id: options.id,
      role: ROLES.VIEW,
      onMessage: this.onMessage.bind(this),
    });

    this.store = initStore(this.messenger);
  }

  /**
   * Create the view object and render it on page
   * @param {Object} options - launch options, assume it is verified in loader
   * {
   *   ... launch options,
   *   globalOptions: { ... },
   *   targetPath: (loader's path)
   * }
   */
  launch(launchOptions) {
    this.destroy();
    const { targetPath, element } = launchOptions;
    EventMessenger.setTargetOrigin(ROLES.LOADER, targetPath);
    const dom = element;
    this.vm = new Vue({
      router,
      store: this.store,
      components: { App },
      template: '<App/>',
    });
    (async () => {
      await this.store.dispatch('initialize', { launchOptions });
      // remove loading icon in iframe page
      const loading = document.getElementById('loading');
      if (loading) {
        loading.remove();
      }
      this.vm.$mount();
      dom.appendChild(this.vm.$el);
    })();
    return this;
  }

  onMessage(message) {
    switch (message.event) {
      case INTERNAL_EVENTS.VIEW_LAUNCH: {
        const { options } = message;
        (async () => {
          if (options.customStyleVars) {
            await buildCustomStyle(options.customStyleVars);
          }
          this.launch(Object.assign(
            {},
            options,
            { element: document.getElementById('kloudless-meeting-scheduler') },
          ));
        })();
        break;
      }
      default:
    }
  }

  destroy() {
    if (this.vm) {
      this.vm.$destroy();
      this.vm.$el.parentElement.innerHTML = '';
    }
  }
}

export default MeetingSchedulerView;
