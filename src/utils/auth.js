/* eslint-disable no-console */
import { pApi, ptApi } from './request';
import store from '../store';
import { sha256 } from 'hash-wasm';

export const doTokenRefresh = async (token) => {
  let res;
  try {
    res = await ptApi.get('/auth/refresh', {
      params: {
        token,
      },
    });
  } catch {
    return false;
  }
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

export const doLogin = async ({ username, password, remember }) => {
  const res = await ptApi.post('/auth/login', {
    username,
    password: await sha256(password),
  });
  if (remember) {
    store.commit('auth/setAuth', res.data.data);
  } else {
    store.commit('auth/setNoRememberAuth', res.data.data);
  }
  // refresh every 58 mins
  setTimeout(() => {
    doTokenRefresh(store.state.auth.token);
  }, 1000 * 60 * 58);
  return res;
};

export const doRegister = async ({ username, password, confirmPassword }) => {
  const res = await ptApi.post('/auth/register', {
    username,
    password: await sha256(password),
    confirmPassword: await sha256(confirmPassword),
  });
  return res;
};

export const checkAuthStatus = async () => {
  if (!store.state.auth.token) {
    return false;
  }
  let res;
  try {
    res = await pApi.get('/auth/getUserInfo');
  } catch (err) {
    console.error('Failed to get user info.', err);
    return false;
  }
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
