import axios from 'axios';

export default {
  setKloudlessAppId(kloudlessAppId) {
    this.kloudlessAppId = kloudlessAppId;
  },
  getKloudlessAppId() {
    return this.kloudlessAppId;
  },
  setKloudlessApiKey(kloudlessApiKey) {
    this.kloudlessApiKey = kloudlessApiKey;
  },
  requestKloudelssApi(uri, queryString) {
    const promise = axios({
      method: 'GET',
      url: `https://api.kloudless.com/v1/${uri}`,
      headers: {
        Authorization: `APIKey ${this.kloudlessApiKey}`,
        Accept: 'application/json',
      },
      params: queryString,
    });

    return promise;
  },
};
