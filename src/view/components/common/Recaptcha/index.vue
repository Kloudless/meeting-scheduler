<script>
import { mapState } from 'vuex';
import Loader from './Loader';


export default {
  name: 'Recaptcha',
  components: {
    Loader,
  },
  computed: mapState({
    siteKey: state => state.meetingWindow.recaptchaSiteKey,
    enableRecaptcha: state => Boolean(state.meetingWindow.recaptchaSiteKey),
  }),
  methods: {
    async execute() {
      if (this.enableRecaptcha) {
        await this.$refs.loader.execute();
      } else {
        this.onVerify();
      }
    },
    onVerify(token) {
      this.$emit('onVerify', token);
    },
    /**
     * @param {Error=} error
     */
    onError(error) {
      /**
       * If error is undefined: it might be due to the invalid site key or no
       * internet connection.
       * Or the reCAPTCHA hasn't ready yet otherwise.
       */
      let detail = null;
      if (error) {
        console.error(error);
        detail = error.message;
      }

      this.$store.dispatch(
        'api/setErrorMessage', {
          message: 'reCAPTCHA error. Please try again or contact Support.',
          detail,
          fireEvent: false,
        },
      );
      this.$emit('onError');
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
  //- Purposely re-mounte Loader whenever siteKey changes by binding key to
  //- siteKey.
  Loader(
    v-if="enableRecaptcha", ref="loader", :key="siteKey", :siteKey="siteKey",
    @onVerify="onVerify", @onError="onError")
  //- Do not render Loader if recaptcha is disabled.
  div(v-else)
</template>
