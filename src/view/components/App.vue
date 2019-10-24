<script>
import { mapState } from 'vuex';
import { EVENTS } from 'constants';
import Footer from './Footer';

export default {
  name: 'App',
  components: {
    Footer,
  },
  data() {
    return {
      initViews: false,
    };
  },
  computed: {
    ...mapState({
      launchOptions: state => state.launchOptions,
      requestErrorMsg: state => state.api.errorMessage,
    }),
    isTimeSlotPage() {
      return this.$route.path.includes('timeSlots');
    },
  },
  created() {
    const defaultRoute = this.launchOptions.setup ?
      '/meetingWindow/' : '/timeSlots/';
    // in vue-router abstract mode, we need to set the initial route.
    this.$router.push(defaultRoute);
  },
  mounted() {
    /** workaround:
     * vuetify has an issue: When recreate the app for the second time,
     * some components will throw the following error:
     * [Vuetify] Unable to locate target [data-app] in "v-menu"
     * [Vuetify] Unable to locate target [data-app] in "v-dialog"
     * Solution: first we create the app with only div(data-app),
     * then we enable rendering other components after the app is mounted
     * so that all vuetify components can find div(data-app)
     */
    this.initViews = true;
    this.$store.dispatch('event', {
      event: EVENTS.OPEN,
    });
  },
  methods: {
    closeDialog() {
      this.$store.dispatch('event', {
        event: EVENTS.CLOSE,
      });
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
div.kloudless-meeting-scheduler
  v-app(id="")
    div(data-app="true")
    template(v-if="initViews")
      div.app-padding
        div.app-padding__header(v-if="launchOptions.mode === 'modal'")
          div.text-xs-right
            v-icon(color="primary", size="28", @click="closeDialog")
              | cancel
        div.app-padding__error.error(:class="{'d-none': !requestErrorMsg}")
          div {{ requestErrorMsg }}
        div.app-padding__content.text-xs-center(:class=`{
            'app-padding__content--fix': isTimeSlotPage}`)
          router-view
        Footer
</template>
