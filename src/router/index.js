import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import i18n from '../plugins/i18n';
import { changeTitle } from '../utils/browser';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "entry" */ '@/view/entry/serviceCheck.vue'),
    meta: {
      title: i18n.t('entry.check'),
    },
  },
  {
    path: '/notAvailable',
    component: () => import(/* webpackChunkName: "entry" */ '@/view/entry/notAvailable.vue'),
    meta: {
      title: i18n.t('entry.cantuse'),
    },
  },
  {
    path: '/notFound',
    component: () => import(/* webpackChunkName: "entry" */ '@/view/entry/notFound.vue'),
    meta: {
      title: i18n.t('entry.notfound'),
    },
  },
  {
    path: '/portal',
    component: () => import(/* webpackChunkName: "entry" */ '@/view/entry/portal.vue'),
    meta: {
      title: i18n.t('portal.login'),
    },
  },
  {
    path: '/app',
    component: () => import(/* webpackChunkName: "layout" */ '@/view/main/layout/layout.vue'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "app.home" */ '@/view/main/home/home.vue'),
        meta: {
          title: i18n.t('home'),
        },
      },
      {
        path: 'lambda',
        component: () => import(/* webpackChunkName: "app.editor" */ '@/view/main/lambda/lambda.vue'),
        meta: {
          title: i18n.t('lambda'),
        },
      },
      {
        path: 'lambda-debugger',
        component: () => import(/* webpackChunkName: "app.lambda.debugger" */ '@/view/main/lambda/debugger.vue'),
        meta: {
          title: i18n.t('debugger'),
        },
      },
      {
        path: 'cfs',
        component: () => import(/* webpackChunkName: "app.editor" */ '@/view/main/cfs/cfs.vue'),
        meta: {
          title: i18n.t('cfs'),
        },
      },
      {
        path: 'keymanage',
        component: () => import(/* webpackChunkName: "app.keymanage" */ '@/view/main/keymanage/keymanage.vue'),
        meta: {
          title: i18n.t('keymanage'),
        },
      },
    ],
  },
  {
    path: '*',
    redirect: '/notFound',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

const directGoPath = ['/', '/notAvailable', '/notFound'];

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    changeTitle(to.meta.title);
  }
  if (!directGoPath.includes(to.path) && !store.state.service.available) {
    next(false);
    router.replace({
      path: '/',
      query: {
        path: to.path,
        q: JSON.stringify(to.query),
      },
    });
    return;
  }
  if (
    !store.state.auth.token
    && to.path.startsWith('/app')
    && to.path !== '/'
    && to.path !== '/portal'
  ) {
    next(false);
    if (!store.state.service.available) {
      router.replace('/');
    } else {
      router.replace('/portal');
    }
    return;
  }
  next();
});

export default router;
