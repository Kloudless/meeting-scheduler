// Vuetify base stylesheet, required
import 'vuetify/src/stylus/app.styl';

// Only import used components here
import Vuetify, {
  VApp,
  VDialog,
  VIcon,
  VContent,
  VContainer,
  VForm,
  VExpansionPanel,
  VExpansionPanelContent,
  VTextField,
  VBtn,
  VBtnToggle,
  VLayout,
  VFlex,
  VAutocomplete,
  VProgressCircular,
} from 'vuetify/lib';

// font styles
import 'css/roboto.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import Vue from 'vue';
import router from 'router';
import App from 'components/App';

import store from 'store';

Vue.config.productionTip = false;
Vue.use(Vuetify, {
  components: {
    VApp,
    VDialog,
    VIcon,
    VContent,
    VContainer,
    VForm,
    VExpansionPanel,
    VExpansionPanelContent,
    VTextField,
    VBtn,
    VBtnToggle,
    VLayout,
    VFlex,
    VAutocomplete,
    VProgressCircular,
  },
});

class MeetingScheduler {
  /**
   * Launch calendar to DOM
   * @param {Object} options - launch options
   * see README for available options
   */
  launch(options) {
    /* eslint-disable no-param-reassign, no-new, no-console */
    this.destroy();


    options = Object.assign({
      mode: 'modal',
    }, options);


    if (!options.appId && !options.eventId) {
      console.error('Meeting Scheduler: appId or eventId is required.');
      return this;
    }

    if (options.mode !== 'modal' && options.mode !== 'attach') {
      options.mode = 'modal';
    }


    let dom;
    if (options.mode === 'attach') {
      if (options.element instanceof Element) {
        dom = options.element;
      } else {
        dom = document.querySelector(options.element);
      }
      // cannot launch attach mode
      // if options.element does not match any DOM Element
      if (!dom) {
        console.error('Meeting Scheduler: element option is missing or it ' +
          'does not match any DOM element');
        return this;
      }
    } else {
      // for modal mode, ignore element option
      dom = document.getElementById('kloudless-meeting-scheduler');
      if (!dom) {
        // create and append an empty div at the end of body
        // if the element does not exist yet
        dom = document.createElement('div');
        dom.setAttribute('id', 'kloudless-meeting-scheduler');
        document.body.appendChild(dom);
      }
    }

    this.vm = new Vue({
      router,
      store,
      components: { App },
      props: ['options'],
      propsData: {
        options,
      },
      template: '<App :options="options"/>',
    });
    this.vm.$mount();

    // empty the dom before attaching the widget
    dom.innerHTML = '';
    dom.appendChild(this.vm.$el);
    return this;
  }

  destroy() {
    if (this.vm) {
      this.vm.$destroy();
      if (this.vm.$el && this.vm.$el.parentNode) {
        this.vm.$el.parentNode.innerHTML = '';
      }
    }
  }
}

export default MeetingScheduler;
