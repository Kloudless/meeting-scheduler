<script>
export default {
  name: 'ToggleButton',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
v-btn.toggle-button(
  depressed, outline, color="primary", :value="value",
  @click="$emit('click', $event)")
  div
    div.font-weight-bold.font-size--md._text {{ text }}
    //- avoid using Vuetify built-in caption class
    div.font-weight-bold.font-size--sm._caption {{ caption }}
</template>
