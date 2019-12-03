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

<template lang="pug">

div.input-field
  InputLabel(:tooltip="tooltip") {{ label }}
  slot

</template>
