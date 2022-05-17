import { createRouter, createWebHistory } from 'vue-router';
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
  {
    path: '/test',
    name: 'Test',
    meta: {
      title: 'test',
      keepAlive: true,
      requireAuth: true,
    },
    component: () => import(/* webpackChunkName: "group-user" */ '@/pages/test/index.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
