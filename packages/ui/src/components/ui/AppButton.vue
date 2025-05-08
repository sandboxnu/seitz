<!--  This component defines a simple button and allows parent component to handle click. */ -->
<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <el-button
    class="bg-primary-200 text-neutral-10 border border-primary-300 rounded-lg px-5 py-1 justify-center"
    @click="$emit('click')"
  >
    <slot />
  </el-button>
</template>
