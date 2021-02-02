/* eslint-disable no-console */
import { Message } from 'element-ui';
import { tApi, nApi } from './request';
import router from '../router';
import store from '../store';
import sha256 from 'crypto-js/sha256';

export const doTokenRefresh = async (token) => {
  const res = await tApi.get('/auth/refresh', {
    query: {
      token,
    },
  });
  if (!res) {
    return false;
  }
  const { uid, username, authToken, refreshToken } = res.data.data;
  store.commit('auth/setUserInfo', {
    uid,
    username,
  });
  store.commit('auth/setToken', {
    authToken,
    refreshToken,
  });
  return true;
};

export const doLogin = async ({
  username,
  password,
}) => {
  const res = await tApi.post('/auth/login', {
    username,
    password: sha256(password),
  });
  if (!res) {
    return false;
  }
  store.commit('auth/setAuth', res.auth);
  Message.success('登录成功');
  router.push('/app');
  return true;
};

export const doRegister = async ({
  username,
  password,
  confirmPassword,
}) => {
  if (password !== confirmPassword) {
    Message.error('两次输入的密码不一致');
    return false;
  }
  const res = await tApi.post('/auth/register', {
    username,
    password: sha256(password),
    confirmPassword: sha256(confirmPassword),
  });
  return !!res;
};

export const checkAuthStatus = async () => {
  if (!store.state.auth.token) {
    return false;
  }
  const res = await nApi.get('/auth/checkStatus');
  if (res) {
    const { uid, username } = res.data.data;
    store.commit('auth/setUserInfo', {
      uid,
      username,
    });
  }
  return !!res;
};
