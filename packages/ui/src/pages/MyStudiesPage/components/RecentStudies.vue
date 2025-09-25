<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title?: string;
  description?: string;
  variants?: number;
  lastModified?: string | Date;
  status?: string;
}

// TODO: temporary test inputs for now, need to pull from mongodb/redis later
const props = withDefaults(defineProps<Props>(), {
  title: "Study Name",
  description:
    "Perhaps some supplemental description can go here and but idk how long and what information they want",
  variants: 50,
  lastModified: "2024-10-24",
  //don't really have different statuses to pull from yet?
  status: "Editing",
});

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
  <!-- TODO: repeat and display 3 most recent studies -->
  <article
    class="sm:p-7 sm:my-9 bg-white rounded-xl ring-1 ring-stone-300/90 shadow-sm flex flex-col gap-3 max-w-md"
    :aria-label="`${title} card`"
  >
    <header class="flex items-start justify-between">
      <h3 class="text-stone-900 text-2xl font-bold leading-7">{{ title }}</h3>
    </header>

    <p v-if="description" class="text-stone-900 text-sm leading-snug">
      {{ description }}
    </p>

    <div class="flex items-center gap-2 text-sm">
      <span class="font-bold text-stone-900">Variants:</span>
      <span class="text-stone-900">{{ variants }}</span>
    </div>

    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-1.5 text-sm">
        <span>Last Modified</span>
        <time :datetime="isoDate">{{ formattedDate }}</time>
      </div>
      <span
        v-if="status"
        class="px-3 py-1.5 rounded-lg ring-1 ring-red-400 bg-rose-100 text-stone-900 text-sm"
      >
        {{ status }}
      </span>
    </div>
  </article>
</template>
