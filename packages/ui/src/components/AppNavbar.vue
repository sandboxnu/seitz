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

// function admin() {
// }
</script>

<template>
  <ElMenu
    :default-active="route.path"
    mode="horizontal"
    :router="true"
    :ellipsis="false"
  >
    <ElMenuItem index="/">Home</ElMenuItem>
    <ElMenuItem index="example">Example</ElMenuItem>
    <div class="flex-grow"></div>
    <template v-if="authStore.currentUser">
      <template v-if="authStore.currentUser.isAdmin">
        <ElMenuItem index="admin">Admin</ElMenuItem>
      </template>
      <ElMenuItem index="logout" :onclick="logOut">
        Log Out, {{ authStore.currentUser.email }}
      </ElMenuItem>
    </template>
    <template v-else>
      <ElMenuItem index="login">Log In</ElMenuItem>
      <ElMenuItem index="signup">Sign Up</ElMenuItem>
    </template>
  </ElMenu>
</template>
