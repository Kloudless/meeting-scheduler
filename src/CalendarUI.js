import Vue from 'vue';
import router from 'router';
import api from 'utls/api';
import App from 'components/App';

Vue.config.productionTip = false;

// for ES6 modules (import)
export default class {
  /**
   * @param {string} kloudlessAppId
   * @param {string} kloudlessApiKey
   */
  constructor(kloudlessAppId, kloudlessApiKey) {
    api.setKloudlessAppId(kloudlessAppId);
    api.setKloudlessApiKey(kloudlessApiKey);
  }

  /**
   * Lauch calendar to DOM
   * @param {string} documentId - the id of DOM which calendar be appended to
   */
  launch(documentId) {
    /* eslint-disable no-new */
    this.vm = new Vue({
      router,
      components: { App },
      template: '<App/>',
    }).$mount(documentId);
    return this;
  }
}
