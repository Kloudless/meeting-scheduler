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
  computed: mapState({
    launchOptions: state => state.launchOptions,
    requestErrorMsg: state => state.api.errorMessage,
  }),
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

<style lang="scss">
@import "./_variables.scss";

.primary--text {
  color: $primary !important;
}
.accent--text {
  color: $accent !important;
}
.success--text {
  color: $success !important;
}
.error--text {
  color: $error !important;
}
.primary {
  color: $white;
  background-color: $primary !important;
}
.accent {
  color: $white;
  background-color: $accent !important;
}
.success {
  color: $white;
  background-color: $success !important;
}
.error {
  color: $white;
  background-color: $error !important;
}

@for $i from 1 through 9 {
  .opacity-#{$i} {
    opacity: 0.1 * $i;
  }
}

// "html" will be transformed to MASTER_CLASS in bundle
html {
  // do not show scroll bar in attach mode
  overflow-y: hidden;
}


.application {
  
  width: $content-width + $widget-padding;
  margin: auto;
  
  .app-padding {
    height: $content-height + $footer-height + $widget-padding;
    overflow: hidden;
    background-color: $background;
    padding: $widget-padding $widget-padding 0 $widget-padding;
    border-radius: 10px;
  }

  .app-scroll-content {
    width: 100%;
    height: $content-height;
    overflow-y: auto !important;
    transition: height 1s;
    
    &.has-error {
      height: $content-height - $error-height;
    }
  }
  .service-error-message {
    height: 0;
    transition: height 1s;
    width: 100%;
    &.has-error {
      height: $error-height;
      padding: 5px;
      overflow-y: auto;
    }
    
  }
  .v-content__wrap > .container {
    padding: 10px;
  }
  .application--wrap {
    // remove unwanted white spaces
    min-height: 0;
  }

  .app-dialog-view {
    .header {
      height: $modal-header-height;
    }
    .app-scroll-content {
      height: $content-height - $modal-header-height;
      &.has-error {
        height: $content-height - $modal-header-height - $error-height;
      }
    }
  }
}

</style>

<template lang="pug">
div.kloudless-meeting-scheduler
  v-app(id="")
    div(data-app="true")
    template(v-if="initViews")
      template(v-if="launchOptions.mode === 'attach'")
        div.app-padding
          div.service-error-message.error(
            :class="{'has-error': requestErrorMsg}")
            div {{ requestErrorMsg }}
          div.app-scroll-content(:class="{'has-error': requestErrorMsg}")
            v-content
              v-container.text-xs-center
                router-view
          Footer
      template(v-else)
        div.app-dialog-view
          div.app-padding
            div.header
              div.text-xs-right
                v-icon(color="primary", size="28", @click="closeDialog")
                  | cancel
            div.service-error-message.error(
              :class="{'has-error': requestErrorMsg}")
              div {{ requestErrorMsg }}
            div.app-scroll-content(:class="{'has-error': requestErrorMsg}")
              v-content
                v-container.text-xs-center
                  router-view
            Footer 
       

</template>
