<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import studiesAPI from "@/api/studies";
import type { GETStudy } from "@seitz/shared";

const props = defineProps<{
  studyId: string | null;
  show: boolean;
}>();

const emit = defineEmits(["close"]);

const study = ref<GETStudy | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const expandedVariants = ref<Set<number>>(new Set([0]));
const expandedSessions = ref<Set<string>>(new Set());

const fetchStudy = async () => {
  if (!props.studyId) {
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    const data = await studiesAPI.getStudy(props.studyId);
    study.value = data as unknown as GETStudy;
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Failed to load study";
    }
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.studyId,
  (newId) => {
    if (newId && props.show) {
      expandedVariants.value = new Set([0]);
      expandedSessions.value = new Set();
      fetchStudy();
    }
  },
  { immediate: true }
);

watch(
  () => props.show,
  (isShowing) => {
    if (isShowing && props.studyId) {
      fetchStudy();
    }
  }
);

const toggleVariant = (index: number) => {
  const newSet = new Set(expandedVariants.value);
  if (newSet.has(index)) {
    newSet.delete(index);
  } else {
    newSet.add(index);
  }
  expandedVariants.value = newSet;
};

const toggleSession = (variantIndex: number, sessionIndex: number) => {
  const key = `${variantIndex}-${sessionIndex}`;
  const newSet = new Set(expandedSessions.value);
  if (newSet.has(key)) {
    newSet.delete(key);
  } else {
    newSet.add(key);
  }
  expandedSessions.value = newSet;
};

const getTaskName = (taskInstance: unknown) => {
  const task = taskInstance as {
    task?: { battery?: { name?: string }; name?: string };
  };
  if (task.task?.battery?.name) {
    return task.task.battery.name;
  }
  if (task.task?.name) {
    return task.task.name;
  }
  return "Session Element";
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.show) {
    emit("close");
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
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
      <div
        class="border-b border-gray-200 p-6 flex items-start justify-between"
      >
        <div class="flex-1 mr-4">
          <h2 class="text-2xl font-semibold mb-2">
            {{ study?.name || "Study Name" }}
          </h2>
          <p class="text-sm text-gray-600">
            {{ study?.description || "" }}
          </p>
        </div>
        <AppButton
          @click="$router.push({ name: 'study', params: { id: studyId } })"
        >
          Edit Study
        </AppButton>
      </div>

      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-gray-500">Loading...</div>
      </div>

      <div v-else-if="error" class="flex-1 flex items-center justify-center">
        <div class="text-red-500">{{ error }}</div>
      </div>

      <div v-else class="flex-1 overflow-y-auto p-4">
        <div
          v-for="(variant, vIdx) in study?.variants || []"
          :key="String(variant._id) || vIdx"
          class="mb-2"
        >
          <button
            class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded transition-colors"
            @click="toggleVariant(vIdx)"
          >
            <span class="font-medium flex-1 text-left text-gray-900">
              Variant {{ vIdx + 1 }}
            </span>

            <svg
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-90': expandedVariants.has(vIdx) }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div v-if="expandedVariants.has(vIdx)" class="ml-8 mt-1">
            <div
              v-for="(session, sIdx) in variant.sessions || []"
              :key="String(session._id) || sIdx"
            >
              <button
                class="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors"
                @click="toggleSession(vIdx, sIdx)"
              >
                <span class="text-red-500 font-medium flex-1 text-left">
                  Session {{ sIdx + 1 }}
                </span>
                <svg
                  class="w-3 h-3 text-gray-400 transition-transform"
                  :class="{
                    'rotate-90': expandedSessions.has(`${vIdx}-${sIdx}`),
                  }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div
                v-if="expandedSessions.has(`${vIdx}-${sIdx}`)"
                class="ml-4 space-y-1"
              >
                <div
                  v-for="(taskInstance, tIdx) in session.tasks || []"
                  :key="String((taskInstance as { _id?: unknown })._id) || tIdx"
                  class="p-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  {{ getTaskName(taskInstance) }}
                </div>

                <div
                  v-if="!session.tasks || session.tasks.length === 0"
                  class="p-2 text-sm text-gray-400 italic"
                >
                  No tasks
                </div>
              </div>
            </div>

            <div
              v-if="!variant.sessions || variant.sessions.length === 0"
              class="p-2 text-sm text-gray-400 italic"
            >
              No sessions
            </div>
          </div>
        </div>

        <div
          v-if="!study?.variants || study.variants.length === 0"
          class="p-4 text-center text-gray-400 italic"
        >
          No variants
        </div>
      </div>
    </div>
  </div>
</template>
