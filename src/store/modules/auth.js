/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import moment from 'moment';

const stored = window.localStorage.getItem('refreshToken');

let refreshToken;

try {
  const refreshTokenObj = stored ? JSON.parse(stored) : null;
  if (
    refreshTokenObj
    && refreshTokenObj.fetchTime
    && moment().diff(moment(refreshTokenObj.fetchTime), 'day') <= 6
  ) {
    refreshToken = refreshTokenObj.token;
  }
} catch (e) {
  console.error('Parse token error', e);
}

const state = {
  uid: null,
  username: null,
  token: null,
  refreshToken: refreshToken || null,
  lastFetch: null,
};

const mutations = {
  setAuth(state, auth) {
    state.uid = auth.uid;
    state.username = auth.username;
    state.token = auth.token.authToken;
    state.refreshToken = auth.token.refreshToken;
    state.lastFetch = moment().valueOf();
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
