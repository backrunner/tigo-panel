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
      title: 'entry.check',
    },
  },
  {
    path: '/notAvailable',
    component: () => import(/* webpackChunkName: "entry" */ '@/view/entry/notAvailable.vue'),
    meta: {
      title: 'entry.cantuse',
    },
  },
  {
    path: '/notFound',
    component: () => import(/* webpackChunkName: "entry" */ '@/view/entry/notFound.vue'),
    meta: {
      title: 'entry.notfound',
    },
  },
  {
    path: '/portal',
    component: () => import(/* webpackChunkName: "entry" */ '@/view/entry/portal.vue'),
    meta: {
      title: 'portal.login',
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
          title: 'home',
        },
      },
      {
        path: 'lambda',
        component: () =>
          import(/* webpackChunkName: "app.editor" */ '@/view/main/lambda/lambda.vue'),
        meta: {
          title: 'lambda',
        },
      },
      {
        path: 'lambda-debugger',
        component: () =>
          import(/* webpackChunkName: "app.lambda.debugger" */ '@/view/main/lambda/debugger.vue'),
        meta: {
          title: 'debugger',
        },
      },
      {
        path: 'lambda-log',
        component: () =>
          import(/* webpackChunkName: "app.lambda.log" */ '@/view/main/lambda/log.vue'),
        meta: {
          title: 'lambda.log',
        },
      },
      {
        path: 'lambda-perm',
        component: () =>
          import(/* webpackChunkName: "app.lambda.perm" */ '@/view/main/lambda/perm.vue'),
        meta: {
          title: 'lambda.perm',
        },
      },
      {
        path: 'hostbinder',
        component: () =>
          import(/* webpackChunkName: "app.hostbinder" */ '@/view/main/hostbinder/hostbinder.vue'),
        meta: {
          title: 'hostbinder',
        },
      },
      {
        path: 'cfs',
        component: () => import(/* webpackChunkName: "app.editor" */ '@/view/main/cfs/cfs.vue'),
        meta: {
          title: 'cfs',
        },
      },
      {
        path: 'keymanage',
        component: () =>
          import(/* webpackChunkName: "app.keymanage" */ '@/view/main/keymanage/keymanage.vue'),
        meta: {
          title: 'keymanage',
        },
      },
      {
        path: 'oss',
        component: () => import(/* webpackChunkName: "app.oss" */ '@/view/main/oss/oss.vue'),
        meta: {
          title: 'oss',
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
    changeTitle(i18n.t(to.meta.title));
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
    !store.state.auth.token &&
    to.path.startsWith('/app') &&
    to.path !== '/' &&
    to.path !== '/portal'
  ) {
    next(false);
    if (!store.state.service.available) {
      router.replace({
        path: '/',
        query: {
          path: to.path,
          q: JSON.stringify(to.query),
        },
      });
    } else {
      router.replace({
        path: '/portal',
        query: {
          path: to.path,
          q: JSON.stringify(to.query),
        },
      });
    }
    return;
  }
  next();
});

export default router;
