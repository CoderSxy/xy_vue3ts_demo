// src/router/index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/ParaliaxRollingPage/index.vue'),
  },
  {
    path: '/earth3d',
    name: 'Earth3D',
    component: () => import('@/views/Earth3D/index.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;