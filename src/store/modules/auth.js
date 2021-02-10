/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import moment from 'moment';

const tokenInfo = window.localStorage.getItem('tokenInfo');

let authToken;
let refreshToken;

if (tokenInfo?.fetchTime) {
  if (moment().diff(moment(tokenInfo.fetchTime), 'minute') < 59) {
    authToken = tokenInfo.authToken;
  }
  if (moment().diff(moment(tokenInfo.fetchTime), 'day') <= 6) {
    refreshToken = tokenInfo.refreshToken;
  }
}

const state = {
  uid: null,
  username: null,
  scopeId: null,
  token: authToken || null,
  refreshToken: refreshToken || null,
  lastFetch: null,
};

const mutations = {
  setAuth(state, auth) {
    const { uid, username, scopeId, token } = auth;
    const { refreshToken, authToken } = token;
    state.uid = uid;
    state.username = username;
    state.scopeId = scopeId;
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
    const { uid, username, scopeId, token } = auth;
    const { authToken } = token;
    state.uid = uid;
    state.username = username;
    state.scopeId = scopeId;
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
  setUserInfo(state, { uid, username, scopeId }) {
    state.uid = uid;
    state.username = username;
    state.scopeId = scopeId;
  },
  clearUserInfo(state) {
    state.uid = null;
    state.username = null;
    state.scopeId = null;
    state.token = null;
    state.refreshToken = null;
    state.lastFetch = null;
    window.localStorage.removeItem('tokenInfo');
    window.localStorage.removeItem('nav');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
