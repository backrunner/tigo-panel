import Vue from 'vue';
import Vuex from 'vuex';

import service from './modules/service';
import locale from './modules/locale';
import auth from './modules/auth';
import nav from './modules/nav';
import debug from './modules/debug';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    service,
    locale,
    auth,
    nav,
    debug,
  },
});
