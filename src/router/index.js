import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'portal',
    component: () => import(/* webpackChunkName: "portal" */ '@/view/portal.vue'),
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

export default router;
