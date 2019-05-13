/**
 * common functions used across Vuex modules
 */

export default {
  /**
   * Return a module creation function that can create a new module
   * instance every time it is called. Actions and mutations will reuse
   * the same reference from input schema, but state object is a new instance
   * so that the state is independent from other stores.
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

    // attach a "reset" mutation which calls state create function again
    if (!moduleIns.mutations) {
      moduleIns.mutations = {};
    }
    /* eslint-disable no-shadow */
    moduleIns.mutations.reset = function reset(state) {
      Object.assign(state, moduleSchema.initState());
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
  },
};
