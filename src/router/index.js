import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import i18n from '../plugins/i18n';
import { changeTitle } from '../utils/browser';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'portal',
    component: () => import(/* webpackChunkName: "portal" */ '@/view/portal.vue'),
    meta: {
      title: i18n.t('portal.login'),
    },
  },
  {
    path: '/app',
    name: 'app',
    component: () => import(/* webpackChunkName: "layout" */ '@/view/appLayout.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    changeTitle(to.meta.title);
  }
  if (store && (!store.auth || store.auth.token) && to.path.startsWith('/app')) {
    return next(false);
  }
  next();
});

export default router;
