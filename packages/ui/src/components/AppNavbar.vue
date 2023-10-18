<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <ElMenu
    :default-active="route.path"
    mode="horizontal"
    :router="true"
    :ellipsis="false"
  >
    <ElMenuItem index="/">Home</ElMenuItem>
    <ElMenuItem index="/example">Example</ElMenuItem>
    <div class="flex-grow"></div>
    <ElMenuItem index="/login">Log In</ElMenuItem>
    <ElMenuItem index="/signup" route="/signup">Sign Up</ElMenuItem>
  </ElMenu>
</template>
