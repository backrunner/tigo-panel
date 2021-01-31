import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { tApi, nApi } from './utils/request';
import './plugins/element/theme/index.css';
import './plugins/element';

Vue.config.productionTip = false;

Vue.prototype.tApi = tApi;
Vue.prototype.nApi = nApi;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
