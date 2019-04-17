// Vuetify base stylesheet, required
import 'vuetify/src/stylus/app.styl';

// Only import used components here
import Vuetify, {
  VApp,
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
import 'view/css/roboto.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import Vue from 'vue';
import router from 'view/router';
import App from 'view/components/App';

import store from 'view/store';

Vue.config.productionTip = false;
Vue.use(Vuetify, {
  components: {
    VApp,
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

class MeetingSchedulerView {
  /**
   * Create the view object and render it on page
   * @param {Object} options - launch options, assume it is verified in loader
   */
  launch(options) {
    this.destroy();

    const dom = options.element;

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
