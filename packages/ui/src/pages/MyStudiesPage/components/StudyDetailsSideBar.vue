<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import AppButton from "@/components/ui/AppButton.vue";
import studiesAPI from "@/api/studies";

const props = defineProps<{
  studyId: string | null;
  show: boolean;
}>();

const emit = defineEmits(["close"]);

const expandedVariants = ref(new Set([0]));
const expandedSessions = ref(new Set<string>());

/**
 * Fetches the study preview whenever studyId changes.
 */
const { data: study, isLoading } = useQuery({
  queryKey: ["study-preview", props.studyId] as const,
  queryFn: async () => {
    if (!props.studyId) return null;
    return await studiesAPI.getStudyPreview(props.studyId);
  },
  enabled: !!props.studyId,
});

/**
 * Reset expanded state when study changes.
 */
watch(
  () => props.studyId,
  () => {
    expandedVariants.value = new Set([0]);
    expandedSessions.value = new Set();
  }
);

const toggleVariant = (index: number) => {
  if (expandedVariants.value.has(index)) {
    expandedVariants.value.delete(index);
  } else {
    expandedVariants.value.add(index);
  }
};

const toggleSession = (variantIndex: number, sessionIndex: number) => {
  const key = `${variantIndex}-${sessionIndex}`;
  if (expandedSessions.value.has(key)) {
    expandedSessions.value.delete(key);
  } else {
    expandedSessions.value.add(key);
  }
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-20 z-40"
    @click="emit('close')"
  >
    <div
      class="fixed right-0 top-0 h-full w-[370px] bg-white shadow-2xl flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div
        class="border-b border-neutral-300 p-6 flex items-start justify-between"
      >
        <div class="flex-1 mr-4">
          <h2 class="text-2xl font-semibold mb-2">
            {{ study?.name || "Study Name" }}
          </h2>
          <p class="text-sm text-gray-600">{{ study?.description || "" }}</p>
        </div>
        <AppButton
          @click="
            $router.push({
              name: 'study',
              params: { id: studyId },
            })
          "
        >
          Edit Study
        </AppButton>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-gray-500">Loading...</div>
      </div>

      <!-- Variants -->
      <div v-else class="flex-1 overflow-y-auto p-4">
        <div
          v-for="(variant, vIdx) in study?.variants"
          :key="vIdx"
          class="mb-2"
        >
          <!-- Variant Button -->
          <button
            class="w-full flex items-center gap-2 p-3 hover:bg-neutral-50 rounded"
            @click="toggleVariant(vIdx)"
          >
            <div
              class="w-5 h-5 rounded bg-orange-500 flex items-center justify-center"
            >
              <svg
                class="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                />
              </svg>
            </div>
            <span class="font-medium flex-1 text-left"
              >Variant {{ vIdx + 1 }}</span
            >
            <span class="text-gray-400">{{
              expandedVariants.has(vIdx) ? "▼" : "▶"
            }}</span>
          </button>

          <!-- Sessions (when expanded) -->
          <div v-if="expandedVariants.has(vIdx)" class="ml-7 mt-1">
            <div v-for="(session, sIdx) in variant.sessions" :key="sIdx">
              <button
                class="w-full flex items-center gap-2 p-2 hover:bg-neutral-50 rounded"
                @click="toggleSession(vIdx, sIdx)"
              >
                <span class="text-red-500 font-medium flex-1 text-left"
                  >Session {{ sIdx + 1 }}</span
                >
                <span class="text-gray-400 text-sm">
                  {{ expandedSessions.has(`${vIdx}-${sIdx}`) ? "▼" : "▶" }}
                </span>
              </button>

              <!-- Tasks (when expanded) -->
              <div
                v-if="expandedSessions.has(`${vIdx}-${sIdx}`)"
                class="ml-4 space-y-1"
              >
                <div
                  v-for="(task, tIdx) in session.tasks"
                  :key="tIdx"
                  class="p-2 text-sm text-gray-700"
                >
                  {{ task || `Task ${tIdx + 1}` }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
