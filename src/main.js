import Vue from 'vue';

import './utils/extend';
import config from './config';
import { tApi, nApi, pApi } from './utils/request';
import idb from './utils/db';

import store from './store';
import router from './router';

import i18n from './plugins/i18n';
import './plugins/element/theme/index.css';
import './plugins/element';

import VueContextMenu from 'vue-context-menu';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueContextMenu, {
  useItem: true,
  mobileSupport: false,
});

Vue.prototype.$apiConfig = config;

Vue.prototype.$idb = idb;

Vue.prototype.$tApi = tApi;
Vue.prototype.$nApi = nApi;
Vue.prototype.$pApi = pApi;

Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
