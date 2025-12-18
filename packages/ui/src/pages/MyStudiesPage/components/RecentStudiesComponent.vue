<script setup lang="ts">
import { computed, ref } from "vue";
//take in title, description, # of variants, last modified date
const props = defineProps<{
  id: string;
  title: string;
  description: string;
  variants: number;
  lastModified: Date;
  status: string;
}>();

const isHovered = ref(false);

const dateObj = computed(() => {
  if (!props.lastModified) return undefined;
  return props.lastModified instanceof Date
    ? props.lastModified
    : new Date(props.lastModified);
});
const formattedDate = computed(() => {
  if (!dateObj.value) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(dateObj.value);
  } catch {
    return "";
  }
});
const isoDate = computed(() =>
  dateObj.value ? dateObj.value.toISOString() : ""
);
</script>
<template>
  <RouterLink
    :to="{ name: 'conditions', params: { id } }"
    :class="[
      'sm:p-6 sm:my-8 rounded-xl ring-1 ring-stone-300/90 shadow-sm flex flex-col gap-3 w-full transition-colors',
      isHovered ? 'bg-gray-100' : 'bg-white',
    ]"
    :aria-label="`${title} card`"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <header class="flex items-start justify-between">
      <h3 class="text-stone-900 text-2xl font-bold leading-7 truncate w-full">
        {{ title }}
      </h3>
    </header>
    <div class="text-stone-900 text-sm w-fll">
      <div class="line-clamp-2">
        <p v-if="description">{{ description }}</p>
        <p v-else class="opacity-0 select-none">placeholder</p>
      </div>
    </div>
    <div class="flex items-center gap-2 text-sm">
      <span class="font-bold text-stone-900">Variants:</span>
      <span class="text-stone-900">{{ variants }}</span>
    </div>
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-1.5 text-sm">
        <span>Last Modified</span>
        <time :datetime="isoDate">{{ formattedDate }}</time>
      </div>
      <span
        class="px-3 py-1.5 rounded-lg ring-1 ring-red-400 bg-rose-100 text-stone-900 text-sm"
        :class="{ 'opacity-0 select-none': !status }"
      >
        {{ status || "placeholder" }}
      </span>
    </div>
  </RouterLink>
</template>
