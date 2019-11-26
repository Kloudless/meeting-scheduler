<script>
import InputLabel from './InputLabel';

export default {
  name: 'InputField',
  components: {
    InputLabel,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    tooltip: {
      type: String,
      default: '',
    },
  },
};

/* eslint-disable */
</script>

<style lang="less">
div.input-field {
  margin-bottom: 12px;

  .input-label.font-weight-bold > .v-btn.v-btn--icon {
    margin: 0px 0px 0px 8px;
  }
}

</style>

<template lang="pug">

div.input-field
  InputLabel(:tooltip="tooltip") {{ label }}
  slot

</template>
