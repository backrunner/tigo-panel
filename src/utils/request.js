/* eslint-disable no-console */
import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
import router from '../router';
import siteConf from '../config';

// Set up axios
const protocol = siteConf.https ? 'https://' : 'http://';
const requestConfig = {
  baseURL: `${protocol}${siteConf.host}${siteConf.base}`,
  timeout: 10000,
};

// internal api without auth
const tApi = axios.create(requestConfig);
// internal api with auth
const nApi = axios.create({
  ...requestConfig,
  headers: {
    Authorization: `Bearer ${store.state.auth.token}`,
  },
});

const errorHandler = (err) => {
  const message = err?.response?.data?.message;
  if (message) {
    Message.error(message);
  }
  console.error('Request API error.', err);
  return Promise.resolve(null);
};

tApi.interceptors.response.use((res) => {
  return res;
}, (err) => {
  return errorHandler(err);
});

nApi.interceptors.response.use((res) => {
  return res;
}, (err) => {
  if (err.response.status === 401) {
    router.replace('/');
  }
  return errorHandler(err);
});

export {
  tApi,
  nApi,
};
