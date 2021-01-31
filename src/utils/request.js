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

nApi.interceptors.response.use((res) => {
  return res;
}, (err) => {
  if (err.response.status === 401) {
    Message.warn('用户权限验证失败');
    router.replace('/');
  }
  return err;
});

export {
  tApi,
  nApi,
};
