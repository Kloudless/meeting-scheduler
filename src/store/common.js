/**
 * common functions used across Vuex modules
 */

export default {
  createState(schema) {
    /** create state by deep copying schema
     * this is to make sure that the values of schema object is never changed
     * and when relaunching the widget, the state can always be reset
     * to the initial values defined in the schema
     */
    return Object.assign({}, JSON.parse(JSON.stringify(schema)));
  },
  mutations: {
    update(state, payload) {
      const { name, value } = payload;
      state[name] = value;
    },
    createResetMutation(initState) {
      return function reset(state) {
        Object.assign(state, JSON.parse(JSON.stringify(initState)));
      };
    },
  },
};
