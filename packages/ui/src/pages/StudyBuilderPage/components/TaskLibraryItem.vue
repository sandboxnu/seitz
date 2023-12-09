<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
  name: string;
  description: string;
  imageUrl: string;
}>();
defineEmits(["flip"]);
</script>

<template>
  <div class="w-40">
    <div
      class="relative w-full h-40 rounded-3xl border-black overflow-hidden border cursor-pointer"
      @click="$emit('flip')"
    >
      <ElImage :src="imageUrl" fit="cover" class="h-full w-full" />
      <div
        class="absolute w-full h-full top-0 left-0 hover:bg-white/40 active:bg-white/60"
      ></div>
      <div
        class="absolute right-3 bottom-3 rounded-full h-6 w-6 bg-black text-white flex justify-center items-center"
      >
        <FontAwesomeIcon :icon="['fas', 'plus']" />
      </div>
    </div>
    <div class="text-base text-black truncate">{{ name }}</div>
  </div>
</template>
