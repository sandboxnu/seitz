<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import studiesAPI from "@/api/studies";

const props = defineProps<{
  studyId: string | null;
  show: boolean;
}>();

const emit = defineEmits(["close"]);

const study = ref<any>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const expandedVariants = ref<Set<number>>(new Set([0]));
const expandedSessions = ref<Set<string>>(new Set());

const fetchStudy = async () => {
  if (!props.studyId) {
    console.log("No studyId provided");
    return;
  }

  console.log("Fetching study:", props.studyId);
  isLoading.value = true;
  error.value = null;

  try {
    const data = await studiesAPI.getStudy(props.studyId);
    console.log("Study data received:", data);
    study.value = data;
  } catch (err: any) {
    const errorMsg =
      err?.response?.data?.message || err?.message || "Failed to load study";
    error.value = errorMsg;
    console.error("Error fetching study:", err);
    console.error("Error details:", {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    });
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

const getTaskName = (taskInstance: any) => {
  if (taskInstance.task?.battery?.name) {
    return taskInstance.task.battery.name;
  }
  if (taskInstance.task?.name) {
    return taskInstance.task.name;
  }
  return "Session Element";
};

// Handle escape key press
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.show) {
    emit("close");
  }
};

// Add/remove escape listener
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
      <!-- Header -->
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

      <!-- Loading State -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="text-gray-500">Loading...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex-1 flex items-center justify-center">
        <div class="text-red-500">{{ error }}</div>
      </div>

      <!-- Content -->
      <div v-else class="flex-1 overflow-y-auto p-4">
        <!-- Variants -->
        <div
          v-for="(variant, vIdx) in study?.variants || []"
          :key="variant._id || vIdx"
          class="mb-2"
        >
          <!-- Variant Header -->
          <button
            class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded transition-colors"
            @click="toggleVariant(vIdx)"
          >
            <!-- Orange Icon -->
            <div
              class="w-5 h-5 rounded bg-orange-500 flex items-center justify-center flex-shrink-0"
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
            <!-- Variant Label -->
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

          <!-- Sessions (when variant is expanded) -->
          <div v-if="expandedVariants.has(vIdx)" class="ml-8 mt-1">
            <div
              v-for="(session, sIdx) in variant.sessions || []"
              :key="session._id || sIdx"
            >
              <!-- Session Header -->
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

              <!-- Tasks (when session is expanded) -->
              <div
                v-if="expandedSessions.has(`${vIdx}-${sIdx}`)"
                class="ml-4 space-y-1"
              >
                <div
                  v-for="(taskInstance, tIdx) in session.tasks || []"
                  :key="taskInstance._id || tIdx"
                  class="p-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  {{ getTaskName(taskInstance) }}
                </div>
                <!-- Empty state for sessions with no tasks -->
                <div
                  v-if="!session.tasks || session.tasks.length === 0"
                  class="p-2 text-sm text-gray-400 italic"
                >
                  No tasks
                </div>
              </div>
            </div>

            <!-- Empty state for variants with no sessions -->
            <div
              v-if="!variant.sessions || variant.sessions.length === 0"
              class="p-2 text-sm text-gray-400 italic"
            >
              No sessions
            </div>
          </div>
        </div>

        <!-- Empty state for studies with no variants -->
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
