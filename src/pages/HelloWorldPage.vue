<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <h1>Hello World</h1>

  <RouterLink to="test">Test</RouterLink>

  <div>
    <ElButton
      type="primary"
      @click="count++"
    >
      count is {{ count }}
    </ElButton>
  </div>
</template>

<style scoped>
</style>
