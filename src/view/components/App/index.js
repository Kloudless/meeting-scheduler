import { mapState } from 'vuex';
import { EVENTS } from 'constants';
import Footer from '../Footer';

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
    let defaultRoute = '/meetingWindow/';
    if (this.launchOptions.schedule) {
      // Launch Schedule View if eventId is supplied
      defaultRoute = '/timeSlots/';
    } else if (this.launchOptions.setup) {
      // In Setup view, get account detail if account info is passed in
      const { accountToken } = this.launchOptions;
      if (accountToken) {
        this.$store.dispatch('account/setAccount', {
          token: accountToken,
        });
      }
    }
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
