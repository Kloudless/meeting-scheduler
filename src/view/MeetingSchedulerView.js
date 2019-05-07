import './vue-setup';

import Vue from 'vue';
import router from 'view/router';
import store from 'view/store';
import App from 'view/components/App';

class MeetingSchedulerView {
  /**
   * Create the view object and render it on page
   * @param {Object} options - launch options, assume it is verified in loader
   */
  launch(options) {
    this.destroy();

    const dom = options.element;

    store.dispatch('initialize', {
      launchOptions: options,
    });

    this.vm = new Vue({
      store,
      router,
      components: { App },
      props: ['options'],
      propsData: {
        options,
      },
      template: '<App :options="options"/>',
    });
    this.vm.$mount();
    dom.appendChild(this.vm.$el);
    return this;
  }

  destroy() {
    if (this.vm) {
      this.vm.$destroy();
    }
  }
}

export default MeetingSchedulerView;
