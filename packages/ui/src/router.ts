import { createRouter, createWebHistory } from "vue-router";
import CarPage from "./pages/CarPage/CarPage.vue";
import HelloWorldPage from "./pages/HelloWorldPage.vue";
import TestPage from "./pages/TestPage.vue";

const routes = [
  { path: "/", name: "helloworld", component: HelloWorldPage },
  { path: "/test", name: "test", component: TestPage },
  { path: "/example", name: "example", component: CarPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
