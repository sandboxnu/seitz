<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <el-button
    class="text-neutral-500 border border-neutral-300 rounded-lg px-5 py-1 justify-center"
    @click="$emit('click')"
  >
    <slot />
  </el-button>
</template>
