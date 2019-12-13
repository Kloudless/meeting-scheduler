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

<template lang="pug">
v-btn.font-weight-bold.btn.font-size--md.pa-0(
  v-bind="btnProps", :loading="loading", :color="color", depressed,
  @click="$emit('click', $event)", :disabled="disabled")
  v-layout(row, align-center, justify-center, :class="{'pa-3': padding}")
    v-icon(v-if="!!icon", left) {{ icon }}
    slot
</template>
