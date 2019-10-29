<script>
import { mapState } from 'vuex';

export default {
  name: 'Footer',
  components: {
  },
  props: [
  ],
  computed: mapState({
    show: state => !state.appHasLogo,
  }),
  methods: {
  },
};

/* eslint-disable */
</script>

<style lang="less">
.footer {
  height: 30px;
  background-color: #f5f7fa;
  margin-top: auto;
  margin-bottom: auto;
}

</style>

<template lang="pug">
div.text-xs-center.footer.pt-2
  a(v-if="show", href="https://kloudless.com", target="_blank")
    img(src="../static/footer.png")

</template>
