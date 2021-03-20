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
const nApi = axios.create(requestConfig);
// internal api without res interceptor
const pApi = axios.create(requestConfig);
const ptApi = axios.create(requestConfig);

const errorHandler = (err) => {
  const message = err?.response?.data?.message;
  if (message) {
    Message.error(message);
  }
  console.error('Request API error.', err);
  return Promise.resolve(null);
};

const authInteceptor = (config) => {
  // eslint-disable-next-line no-param-reassign
  config.headers = {
    Authorization: `Bearer ${store.state.auth.token}`,
  };
  return config;
};

tApi.interceptors.response.use((res) => {
  return res;
}, (err) => {
  return errorHandler(err);
});

nApi.interceptors.request.use(authInteceptor);

nApi.interceptors.response.use((res) => {
  return res;
}, (err) => {
  if (err.response.status === 401 && router.currentRoute.path !== '/portal') {
    router.replace('/portal');
  }
  return errorHandler(err);
});

pApi.interceptors.request.use(authInteceptor);

export {
  tApi,
  nApi,
  pApi,
  ptApi,
};
