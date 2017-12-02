import api from 'utls/api';
import Kloudless from '../../../lib/kloudless.authenticator';

export default {
  name: 'Login',
  mounted() {
    const config = {
      client_id: api.getKloudlessAppId(),
      scope: 'google_calendar outlook_calendar caldav',
    };
    Kloudless.authenticator(
      document.getElementById('auth-button'), config,
      this.kAuthCallback.bind(this),
    );
  },
  methods: {
    kAuthCallback(result) {
      if (result.error) {
        /* eslint-disable-next-line no-console */
        console.error('An error occurred:', result.error);
        return;
      }
      this.$emit('auth-success', result.account.id, result.account.account);
    },
  },
};
