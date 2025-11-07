import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import CarPage from "./pages/CarPage/CarPage.vue";
import AuthLoginForm from "./components/AuthLoginForm.vue";
import AuthSignupForm from "./components/AuthSignupForm.vue";
import MyStudiesPage from "./pages/MyStudiesPage/MyStudiesPage.vue";
import AdminPage from "./pages/AdminPage/AdminPage.vue";
import StudyBuilderPage from "./pages/StudyBuilderPage/StudyBuilderPage.vue";
import AdminUsersPage from "./pages/AdminUsersPage/AdminUsersPage.vue";
import ProfilePage from "./pages/ProfilePage/ProfilePage.vue";
import LandingPage from "./pages/LandingPage/LandingPage.vue";

const routes: RouteRecordRaw[] = [
  { path: "/home", name: "home", component: LandingPage },
  { path: "/example", name: "example", component: CarPage },
  { path: "/login", name: "login", component: AuthLoginForm },
  { path: "/signup", name: "signup", component: AuthSignupForm },
  { path: "/studies", name: "studies", component: MyStudiesPage },
  { path: "/admin", name: "admin", component: AdminPage },
  { path: "/admin/users", name: "adminUsers", component: AdminUsersPage },
  { path: "/study/:id", name: "study", component: StudyBuilderPage },
  { path: "/profile", name: "profile", component: ProfilePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
