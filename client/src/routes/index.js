// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Register from '@/views/Register.vue';
import Group from '@/views/Group.vue';
import List from '@/views/List.vue';
import MentionsLegales from '@/views/MentionsLegales.vue';
import Account from '@/views/Account.vue';
import GeneratedList from '@/views/GeneratedList.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/mentions-legales', component: MentionsLegales },
  { path: '/home', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/account', component: Account, meta: { requiresAuth: true } },
  { path: '/group/:groupId', component: Group, meta: { requiresAuth: true } },
  { path: '/group/:groupId/list/:listId', component: List, meta: { requiresAuth: true } },
  { path: '/group/:groupId/list/:listId/generated-list', component: GeneratedList, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;