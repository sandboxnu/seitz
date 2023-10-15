<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <ElMenu :default-active="route.path" mode="horizontal" :router="true">
    <ElMenuItem index="/">Hello</ElMenuItem>
    <ElMenuItem index="/test">Test</ElMenuItem>
    <ElMenuItem index="/example">Example</ElMenuItem>
  </ElMenu>
</template>
