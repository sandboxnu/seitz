<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const authStore = useAuthStore();
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
      <ElMenuItem index="logout" route="/" :onclick="authStore.logOut">
        Log Out, {{ authStore.currentUser.email }}
      </ElMenuItem>
    </template>
    <template v-else>
      <ElMenuItem index="login">Log In</ElMenuItem>
      <ElMenuItem index="signup">Sign Up</ElMenuItem>
    </template>
  </ElMenu>
</template>
