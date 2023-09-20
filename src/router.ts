import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import Test from './components/Test.vue';

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/test', component: Test }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
