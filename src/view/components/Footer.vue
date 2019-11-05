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

<template lang="pug">
div.text-xs-center.footer.pt-2
  a(v-if="show", href="https://kloudless.com", target="_blank")
    img(src="../static/footer.png")

</template>
