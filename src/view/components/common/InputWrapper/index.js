/**
 * Used to extract common CSS part of Authenticator and AvailabilityField.
 */

export default {
  name: 'InputWrapper',
  props: {
    value: {
      validator: () => true,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },
};
