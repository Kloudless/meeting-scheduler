<script>
import { mapState } from 'vuex';
import { EVENTS, ACTIONS } from 'constants';
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
    }),
    innerScroll() {
      /**
       * Fix the outer container's height and only the inner container can be
       * scrolled. Should be used along with `v-layout`, `.time-slots` and
       * `timeslots-scroll-panel`.
       *
       * For example, the HTML mockup should be:
       * div.app-padding__content.app-padding__content--fix
       *   v-layout.time-slots(column)
       *     div
       *       | header (can't scroll)
       *     div.timeslots-scroll-panel
       *       | the scrollable content
       *     div
       *       | footer (can't scroll)
       */
      const { path } = this.$route;
      return !path.includes('/meetingWindow/');
    },
  },
  created() {
    // in vue-router abstract mode, we need to set the initial route.
    const { setup, schedule } = this.launchOptions;
    if (setup) {
      this.$router.push('/meetingWindow/');
    } else if (schedule.scheduledEventId) {
      this.$router.push('/viewScheduledEvent');
    } else {
      this.$router.push(`/timeSlots/${ACTIONS.CREATE}`);
    }
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
        div.app-padding__content.text-xs-center(
            :class="{'app-padding__content--fix': innerScroll}")
          router-view
        Footer
</template>
