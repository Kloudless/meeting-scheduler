import KloudlessAuth from 'kloudless-authenticator/src/auth-widget';
import { mapState } from 'vuex';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';

/** auth-widget was designed to be bound to window.Kloudless with script tag.
 * Manually assign KloudlessAuth into window.Kloudless here.
 * Use setTimeout because in production build, the scheduler is bound to
 * window.Kloudless after the whole script is loaded via script tag.
 */
setTimeout(() => {
  window.Kloudless = window.Kloudless || {};
  Object.assign(window.Kloudless, KloudlessAuth);
}, 1);

export default {
  name: 'Authenticator',
  components: {
    Dropdown,
    Button,
  },
  props: [
  ],
  computed: mapState({
    account: state => state.account,
    calendars: state => (
      state.account.calendars.map(calendar => ({
        text: calendar.name,
        value: calendar.id,
      }))
    ),
    appId: state => state.launchOptions.appId,
    loading: state => state.api.loading.account,
  }),
  methods: {
    onAddAccount(e) {
      KloudlessAuth.stop(e.target);
      const auth = KloudlessAuth.authenticator(
        e.target,
        {
          client_id: this.appId,
          scope: 'any:normal.calendar',
        },
        this.handleAuthResult,
      );
      auth.launch();
    },
    handleAuthResult(result) {
      if (!result.account) {
        this.$store.commit({
          type: 'api/setErrorMessage',
          message: 'An error occurred connecting your account.',
        }, { root: true });
      } else {
        this.$store.dispatch({
          type: 'account/setAccount',
          id: result.account.id,
          account: result.account.account,
          token: result.access_token,
        });
      }
    },
    removeAccount() {
      this.$store.commit({
        type: 'account/removeAccount',
      });
    },
    setCalendarId(event) {
      this.$store.commit({
        type: 'account/setCalendarId',
        calendarId: event.value,
      });
    },
  },
};
