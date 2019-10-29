<script>
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

/* eslint-disable */
</script>

<style lang="scss">
@import '../_variables.scss';

.v-input.input-wrapper {
  .content {
    width: 100%;
    text-align: center;
  }

  &.error--text > .v-input__control > .v-input__slot > .content > .v-btn {
    color: $error !important;
  }

  .v-messages > .v-messages__wrapper .v-messages__message {
    width: 100%;
    text-align: center;
    color: $error;
  }
}
</style>

<template lang="pug">
v-input.input-wrapper(:value="value", :rules="rules",
                      :hide-details="hideDetails")
  div.content
    slot
</template>
