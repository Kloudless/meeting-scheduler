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

<template lang="pug">
v-input.input-wrapper(:value="value", :rules="rules",
                      :hide-details="hideDetails")
  div.content
    slot
</template>
