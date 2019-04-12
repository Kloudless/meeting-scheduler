import { mapState } from 'vuex';
import Footer from '../Footer';

export default {
  name: 'App',
  props: ['options'],
  components: {
    Footer,
  },
  data() {
    return {
      dialog: false,
      initViews: false,
    };
  },
  computed: mapState({
    requestErrorMsg: state => state.api.errorMessage,
  }),
  created() {
    this.$store.dispatch({
      type: 'initialize',
      launchOptions: this.options,
    });

    let defaultRoute = '/meetingWindow/';
    if (this.options.eventId) {
      // Launch Schedule View if eventId is supplied
      defaultRoute = '/timeSlots/';
    } else if (this.options.accountToken) {
      // In Setup view, get account detail if account info is passed in
      const { accountToken } = this.options;
      this.$store.dispatch('account/setAccount', {
        token: accountToken,
      });
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

    /** workaround:
     * v-dialog will not render overlay if initialized with bonding model
     * setting to true
     * Solution: render v-dialog with model=false, then set to true shortly
     */
    if (this.options.mode === 'modal') {
      setTimeout(() => {
        this.dialog = true;
      }, 1);
    }
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
  },
};
