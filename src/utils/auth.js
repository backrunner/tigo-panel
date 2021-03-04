/* eslint-disable no-console */
import { tApi, nApi } from './request';
import store from '../store';
import sha256 from 'crypto-js/sha256';

export const doTokenRefresh = async (token) => {
  const res = await tApi.get('/auth/refresh', {
    params: {
      token,
    },
  });
  if (!res) {
    return false;
  }
  const { uid, username, scopeId, authToken, refreshToken } = res.data.data;
  store.commit('auth/setUserInfo', {
    uid,
    username,
    scopeId,
  });
  store.commit('auth/setToken', {
    authToken,
    refreshToken,
  });
  setTimeout(() => {
    doTokenRefresh(store.state.auth.token);
  }, 1000 * 60 * 58);
  return true;
};

export const doLogin = async ({
  username,
  password,
  remember,
}) => {
  const res = await tApi.post('/auth/login', {
    username,
    password: sha256(password).toString(),
  });
  if (!res) {
    return false;
  }
  if (remember) {
    store.commit('auth/setAuth', res.data.data);
  } else {
    store.commit('auth/setNoRememberAuth', res.data.data);
  }
  // refresh every 58 mins
  setTimeout(() => {
    doTokenRefresh(store.state.auth.token);
  }, 1000 * 60 * 58);
  return true;
};

export const doRegister = async ({
  username,
  password,
  confirmPassword,
}) => {
  const res = await tApi.post('/auth/register', {
    username,
    password: sha256(password).toString(),
    confirmPassword: sha256(confirmPassword).toString(),
  });
  return !!res;
};

export const checkAuthStatus = async () => {
  if (!store.state.auth.token) {
    return false;
  }
  const res = await nApi.get('/auth/getUserInfo');
  if (res) {
    const { uid, username, scopeId } = res.data.data;
    store.commit('auth/setUserInfo', {
      uid,
      username,
      scopeId,
    });
    setTimeout(() => {
      doTokenRefresh(store.state.auth.token);
    }, 1000 * 60 * 58);
  }
  return !!res;
};
