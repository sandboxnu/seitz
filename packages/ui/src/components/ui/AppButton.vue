<script setup lang="ts">
defineEmits(["click"]);
</script>

<template>
  <el-button
    class="bg-black text-white border border-black rounded-lg px-5 py-1 justify-center"
    @click="$emit('click')"
  >
    <slot />
  </el-button>
</template>
