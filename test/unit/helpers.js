import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const router = new VueRouter();

export function getWrapper(component, options) {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  localVue.use(Vuex);
  const compOptions = Object.assign({}, {
    localVue,
    router,
  }, options);
  const wrapper = shallowMount(component, compOptions);
  return wrapper;
}

export function createEmptyComponent() {
  return new Vue({
    store: new Vuex.Store({}),
  });
}
