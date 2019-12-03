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

<template lang="pug">

div.text-xs-left.input-label.font-weight-bold
  v-layout.align-center
    span.on-secondary--text
      slot
    v-tooltip(v-if="!!tooltip", top, content-class="tooltip-container")
      template(v-slot:activator="{ on }")
        v-btn(icon, v-on="on")
          v-icon help_outline
      span {{ tooltip }}

</template>
