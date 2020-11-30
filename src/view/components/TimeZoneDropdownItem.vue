<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
/* eslint-disable */
</script>

<template lang="pug">
v-layout(v-if="item.suffix", row, justify-space-between, align-center)
  span {{ item.text }}
  span.caption {{ item.suffix }}
span(v-else) {{ item.text }}
</template>
