/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import moment from 'moment';

const stored = window.localStorage.getItem('tokenInfo');

let authToken;
let refreshToken;

try {
  const tokenInfo = stored ? JSON.parse(stored) : null;
  if (
    tokenInfo
    && tokenInfo.fetchTime
  ) {
    if (moment().diff(moment(tokenInfo.authToken), 'minute') <= 30) {
      authToken = tokenInfo.authToken;
    }
    if (moment().diff(moment(tokenInfo.fetchTime), 'day') <= 6) {
      refreshToken = tokenInfo.refreshToken;
    }
  }
} catch (e) {
  console.error('Parse token error', e);
}

const state = {
  uid: null,
  username: null,
  token: authToken || null,
  refreshToken: refreshToken || null,
  lastFetch: null,
};

const mutations = {
  setAuth(state, auth) {
    const { uid, username, token } = auth;
    const { refreshToken, authToken } = token;
    state.uid = uid;
    state.username = username;
    state.token = authToken;
    state.refreshToken = refreshToken;
    state.lastFetch = moment().valueOf();
    window.localStorage.setItem('tokenInfo', {
      authToken,
      refreshToken,
      fetchTime: state.lastFetch,
    });
  },
  setNoRememberAuth(state, auth) {
    const { uid, username, token } = auth;
    const { authToken } = token;
    state.uid = uid;
    state.username = username;
    state.token = authToken;
    state.lastFetch = moment().valueOf();
    window.localStorage.setItem('tokenInfo', {
      authToken,
      refreshToken: null,
      fetchTime: state.lastFetch,
    });
  },
  setToken(state, { authToken, refreshToken }) {
    state.token = authToken;
    state.refreshToken = refreshToken;
    state.lastFetch = moment().valueOf();
    window.localStorage.setItem('tokenInfo', {
      authToken,
      refreshToken,
      fetchTime: state.lastFetch,
    });
  },
  setUserInfo(state, { uid, username }) {
    state.uid = uid;
    state.username = username;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
