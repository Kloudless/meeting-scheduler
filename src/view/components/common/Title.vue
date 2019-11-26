<script>
export default {
  name: 'Title',
  components: {
  },
  props: [
  ],
  methods: {
  },
};

/* eslint-disable */
</script>

<style lang="less">

@import "../_variables.less";

.page-title {
  border-bottom: 5px solid @primary;
  color: #04214a;
}
</style>

<template lang="pug">
div.page-title.pb-2.mb-4
  span.display-1.font-weight-bold
    slot

</template>
