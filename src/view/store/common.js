/**
 * common functions used across Vuex modules
 */
import Vue from 'vue';

export default {
  /**
   * Return a module created from moduleSchema and attach 'reset' mutation.
   * @param {Object} moduleSchema
   *   module schema object. Schema is the same as Vuex module.
   *   It should not contain state, but a 'initState' function
   *   that returns an object to present initial state
   */
  createModule(moduleSchema) {
    const { initState, state, ...rest } = moduleSchema;

    const moduleIns = {
      state: initState(),
      ...rest,
    };

    // attach a "reset" mutation which calls initState
    if (!moduleIns.mutations) {
      moduleIns.mutations = {};
    }
    /* eslint-disable no-shadow */
    moduleIns.mutations.reset = function reset(state) {
      Object.assign(state, initState());
    };
    /* eslint-enable */
    return moduleIns;
  },
  actions: {
  },
  mutations: {
    update(state, payload) {
      const { name, value } = payload;
      state[name] = value;
    },
    setVisible(state, payload) {
      const { name, visible } = payload;
      Vue.set(state.visible, name, Boolean(visible));
    },
  },
};
