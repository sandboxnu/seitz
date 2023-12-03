import { createRouter, createWebHistory } from "vue-router";
import CarPage from "./pages/CarPage/CarPage.vue";
import HelloWorldPage from "./pages/HelloWorldPage.vue";
import AuthLoginForm from "./components/AuthLoginForm.vue";
import AuthSignupForm from "./components/AuthSignupForm.vue";
import MyStudiesPage from "./pages/MyStudiesPage/MyStudiesPage.vue";
import AdminPage from "./pages/AdminPage.vue";
import StudyBuilderPage from "./pages/StudyBuilderPage/StudyBuilderPage.vue";

const routes = [
  { path: "/", name: "helloworld", component: HelloWorldPage },
  { path: "/example", name: "example", component: CarPage },
  { path: "/login", name: "login", component: AuthLoginForm },
  { path: "/signup", name: "signup", component: AuthSignupForm },
  { path: "/dashboard", name: "dashboard", component: MyStudiesPage },
  { path: "/admin", name: "admin", component: AdminPage },
  { path: "/study/:id", name: "study", component: StudyBuilderPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
