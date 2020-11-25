<script>
import recaptchaHelper from '../../../utils/recaptcha-helper';


export default {
  name: 'RecaptchaLoader',
  data() {
    return { recaptchaId: null };
  },
  props: {
    siteKey: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    try {
      // Do this in mounted to make sure the container element is rendered.
      this.recaptchaId = await recaptchaHelper.render(
        this.$refs.container,
        this.siteKey,
        this.onVerify.bind(this),
        this.onVerifyError.bind(this),
      );
    } catch (err) {
      this.$emit('onError', err);
    }
  },
  methods: {
    async execute() {
      try {
        await recaptchaHelper.execute(this.recaptchaId);
      } catch (err) {
        // In case recaptchaHelper.execute() is executed before
        // recaptchaHelper.render() finishes, althought it's almost impossible.
        this.$emit('onError', err);
      }
    },
    onVerify(token) {
      this.$emit('onVerify', token);
    },
    onVerifyError() {
      this.$emit('onError');
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
  div(ref="container")
</template>
