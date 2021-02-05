import Vue from 'vue';

import './utils/extend';
import { tApi, nApi } from './utils/request';

import store from './store';
import router from './router';

import i18n from './plugins/i18n';
import './plugins/element/theme/index.css';
import './plugins/element';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.prototype.$tApi = tApi;
Vue.prototype.$nApi = nApi;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
