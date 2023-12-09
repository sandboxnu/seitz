<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

function logOut() {
  authStore.logOut();
  router.push("/login");
}
</script>

<template>
  <ElMenu
    class="border-b-0 flex items-center"
    :default-active="route.path"
    mode="horizontal"
    :router="true"
    :ellipsis="false"
    background-color="black"
    text-color="white"
    active-text-color="white"
  >
    <RouterLink
      to="/"
      class="text-white text-xl pl-6 mr-2 pb-1 flex items-center"
    >
      <span class="font-light">Northeastern</span>&nbsp;
      <span class="font-bold">Brain Game Center</span>
    </RouterLink>
    <template v-if="authStore.currentUser">
      <ElMenuItem index="/studies">My Studies</ElMenuItem>
      <div class="flex-1"></div>
      <template v-if="authStore.currentUser.isAdmin">
        <ElMenuItem index="/admin">Admin</ElMenuItem>
      </template>
      <ElMenuItem index="/logout" :onclick="logOut">
        Log Out, {{ authStore.currentUser.email }}
      </ElMenuItem>
    </template>
    <template v-else>
      <div class="flex-1"></div>
      <ElMenuItem index="/login">Log In</ElMenuItem>
      <ElMenuItem index="/signup">Sign Up</ElMenuItem>
    </template>
  </ElMenu>
</template>

<style>
.el-menu-item:hover {
  background: #333333 !important;
}
</style>
