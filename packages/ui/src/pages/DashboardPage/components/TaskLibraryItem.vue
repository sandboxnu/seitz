<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
  selected: boolean;
  name: string;
  description: string;
}>();
defineEmits(["flip"]);

const uuid = crypto.randomUUID();
</script>

<template>
  <div class="w-40">
    <ElTooltip effect="dark" :content="description" placement="right">
      <div
        :class="[
          'relative w-full h-40 rounded-3xl border-black overflow-hidden',
          selected ? 'border-4' : 'border cursor-pointer',
        ]"
        @click="if (!selected) $emit('flip');"
      >
        <ElImage
          :src="`https://picsum.photos/300/300?${uuid}`"
          fit="cover"
          class="h-full w-full"
        />
        <div
          v-if="selected"
          class="absolute w-full h-full top-0 left-0 bg-white/60"
        ></div>
        <div class="absolute right-3 bottom-3">
          <div
            class="rounded-full h-6 w-6 bg-black text-white flex justify-center items-center"
          >
            <FontAwesomeIcon :icon="['fas', selected ? 'check' : 'plus']" />
          </div>
        </div>
      </div>
    </ElTooltip>
    <ElTooltip effect="dark" :content="name" placement="bottom">
      <div class="text-base text-black truncate">{{ name }}</div>
    </ElTooltip>
  </div>
</template>
