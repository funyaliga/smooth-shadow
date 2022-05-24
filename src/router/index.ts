import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: true,
      requireAuth: false,
    },
    component: () => import(/* webpackChunkName: "group-user" */ '@/pages/login/index.vue'),
  },
  {
    path: '/',
    name: 'Index',
    meta: {
      title: '首页',
      keepAlive: true,
      requireAuth: true,
    },
    component: () => import(/* webpackChunkName: "group-user" */ '@/pages/home/index.vue'),
  },
];

const router = createRouter({
  history: createWebHistory('/smooth-shadow/dist/'),
  routes,
});
export default router;
