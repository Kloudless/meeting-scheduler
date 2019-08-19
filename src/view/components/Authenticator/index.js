import authenticator from '@kloudless/authenticator/src/auth-widget';
import { mapState } from 'vuex';
import { EVENTS } from 'constants';
import { isRequired } from '../../utils/form_validator';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import InputWrapper from '../common/InputWrapper';

export default {
  name: 'Authenticator',
  components: {
    Dropdown,
    Button,
    InputWrapper,
  },
  data() {
    return { rules: [isRequired] };
  },
  props: {
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
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
    baseUrl: state => state.launchOptions.globalOptions.baseUrl,
    authOptions: state => state.launchOptions.setup.authOptions,
  }),
  methods: {
    onAddAccount(e) {
      // TODO: migrate to authenticator global options
      if (!window.Kloudless) {
        window.Kloudless = {};
      }
      window.Kloudless.baseUrl = this.baseUrl;
      authenticator.stop(e.target);
      const auth = authenticator.authenticator(
        e.target,
        {
          ...this.authOptions,
          ...{ client_id: this.appId },
        },
        this.handleAuthResult,
      );
      auth.launch();
    },
    handleAuthResult(result) {
      if (!result.account) {
        this.$store.dispatch('api/setErrorMessage', {
          message: 'An error occurred connecting your account.',
        });
        return;
      }

      if (!result.account.apis.includes('calendar')) {
        const { account } = result;
        this.$store.dispatch('api/setErrorMessage', {
          message: `The connected account doesn't support calendar API.
          Account: ${account.account}. Service: ${account.service_name}`,
        });
        return;
      }

      this.$store.dispatch('account/setAccount', {
        id: result.account.id,
        account: result.account.account,
        token: result.access_token,
      });
      this.$store.dispatch('event', {
        event: EVENTS.CONNECT_ACCOUNT,
        account: result.account,
        confidentialData: {
          accountToken: result.access_token,
        },
      });
    },
    removeAccount() {
      this.$store.commit({
        type: 'account/reset',
      });
      this.$store.dispatch('event', {
        event: EVENTS.REMOVE_ACCOUNT,
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
