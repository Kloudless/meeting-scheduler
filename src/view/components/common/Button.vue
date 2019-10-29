<script>

export default {
  name: 'Button',
  components: {
  },
  props: {
    btnProps: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: Boolean,
      default: true,
    },
    click: Function,
    color: {
      type: String,
      default: 'primary',
    },
    icon: {
      type: String,
      default: '',
    },
  },
};

/* eslint-disable */
</script>

<style lang="less">
@import "../_variables.less";

.btn {
  &.v-btn {
    border-radius: 5px;
    height: 100%;
  }
  .theme--light.v-btn.v-btn--disabled:not(.v-btn--icon):not(.v-btn--flat) {
    background-color: @primary !important;
    color: @white !important;
    opacity: 0.2;
  }
}
</style>

<template lang="pug">
v-btn(v-bind="btnProps", :loading="loading", :color="color", depressed,
  @click="$emit('click', $event)", :disabled="disabled").font-weight-bold.btn
  v-layout(row, align-center, justify-center, :class="{'pa-3': padding}")
    v-icon(v-if="!!icon", left) {{ icon }}
    slot
</template>
