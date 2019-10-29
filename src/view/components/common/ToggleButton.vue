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

<style lang="scss">
@import "../_variables.scss";

.toggle-button.v-btn {
  flex: 1;
  height: 100%;
  & > .v-btn__content {
    text-transform: none;
    height: 100%;
    .text {
      font-size: 16px;
    }
    .caption {
      opacity: 0.4;
    }
  }
  &.v-btn--active {
    background-color: $primary !important;
    .text {
      color: $background;
    }
    .caption {
      color: $white;
    }
  }
  &:not(.v-btn--active) {
    background-color: $background !important;
    .text {
      color: $primary;
    }
    .caption {
      color: $primary;
    }
    opacity: 1;
  }
}

</style>

<template lang="pug">
v-btn(depressed, outline, color="primary",
      :value="value", @click="$emit('click', $event)").toggle-button
  div
    div.font-weight-bold.text {{ text }}
    div.font-weight-bold.caption {{ caption }}
</template>
