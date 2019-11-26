<script>

export default {
  name: 'InputLabel',
  props: {
    tooltip: {
      type: String,
      default: '',
    },
  },
};

/* eslint-disable */
</script>

<style lang="less">
@import "../_variables.less";

.tooltip-container {
  right: 40px;
}

div.input-label {
  font-size: 12px;
  text-transform: uppercase;
  white-space: nowrap;

  .v-btn.v-btn--icon {
    color: @success;
  }
}

</style>

<template lang="pug">

div.text-xs-left.accent--text.input-label.font-weight-bold
  v-layout.align-center
    span.opacity-4
      slot
    v-tooltip(v-if="!!tooltip", top, content-class="tooltip-container")
      template(v-slot:activator="{ on }")
        v-btn(icon, v-on="on", small)
          v-icon help_outline
      span {{ tooltip }}

</template>
