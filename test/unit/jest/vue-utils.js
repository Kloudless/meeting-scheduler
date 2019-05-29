import { shallowMount, createLocalVue } from '@vue/test-utils';

import VueRouter from 'vue-router';
import Vuex from 'vuex';

import { schema, createModules } from 'view/store/index';
import router from 'view/router';
import { deepMerge, createMessenger } from './utils';


export function getWrapper(component, options, defaultRoute) {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  localVue.use(Vuex);
  const compOptions = Object.assign({}, {
    localVue,
    router,
  }, options);

  if (defaultRoute) {
    router.replace(defaultRoute);
  } else {
    router.replace('');
  }

  const wrapper = shallowMount(component, compOptions);
  return wrapper;
}

export function createStore(schemaOverrides = {}, messenger = null) {
  const storeSchema = deepMerge(
    {},
    schema,
    schemaOverrides,
  );
  createModules(storeSchema);

  const states = {
    root: storeSchema.state,
  };
  Object.keys(storeSchema.modules).forEach((moduleName) => {
    states[moduleName] = storeSchema.modules[moduleName].state;
  });

  const store = new Vuex.Store(storeSchema);
  store.messenger = messenger || createMessenger();
  return {
    states,
    store,
  };
}
