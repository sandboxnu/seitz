<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { ref, computed, watch } from "vue";
import SessionCard from "./SessionCard.vue";
import TagLabel from "./TagLabel.vue";
import Draggable from "vuedraggable";
import studiesAPI from "@/api/studies";

const props = defineProps<{ collapsed?: boolean }>();
const emit = defineEmits<(e: "collapse-change", value: boolean) => void>();

const selectedOption = ref("Details");
const studyBuilderStore = useStudyBuilderStore();

const collapsePressed = ref(false);
const isCollapsed = computed(() => collapsePressed.value);

watch(
  () => props.collapsed,
  (val) => {
    if (typeof val === "boolean") collapsePressed.value = val;
  },
  { immediate: true }
);

const draggableProps = {
  chosenClass: "bg-stone-200",
  dragClass: "bg-stone-200",
  ghostClass: "invisible",
  animation: 100,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const variantData = computed<Record<string, any>>({
  get: () => {
    return (
      studyBuilderStore.variants.find(
        (variant) => variant._id === studyBuilderStore.currentVariantId
      ) || {}
    );
  },
  set(newData) {
    const index = studyBuilderStore.variants.findIndex(
      (variant) => variant._id === studyBuilderStore.currentVariantId
    );
    if (index !== -1) {
      studyBuilderStore.variants[index] = {
        ...studyBuilderStore.variants[index],
        ...newData,
      };
    }
  },
});

function updateVariantName() {
  const variant = studyBuilderStore.variants.find(
    (v) => v._id === studyBuilderStore.currentVariantId
  );
  if (!variant) return;

  const payload = {
    _id: variant._id,
    name: variant.name ?? "",
    description: variant.description ?? "",
    sessions: variant.sessions,
    serverCode: variant.serverCode ?? "",
    tags: Array.isArray(variant.tags) ? variant.tags : [],
    type: variant.type ?? "",
  };

  studiesAPI.updateVariant(
    studyBuilderStore.studyId,
    studyBuilderStore.currentVariantId,
    payload
  );
}
</script>

<template>
  <div
    :class="[
      'bg-neutral-10 fixed flex flex-row items-stretch h-full border border-neutral-300 rounded-l-2xl pt-8 shadow-2xl right-0 transition-all duration-200',
      isCollapsed ? 'w-16 px-3' : 'w-[300px] px-4',
    ]"
  >
    <div class="justify-center flex flex-col pr-4">
      <ElImage
        v-if="!isCollapsed"
        src="/icons/fa6-solid_angles-right-gray.svg"
        class="h-5 w-5 mb-4 self-start cursor-pointer"
        @click="(collapsePressed = true), emit('collapse-change', true)"
      />
      <ElImage
        v-else
        src="/icons/fa6-solid_angles-right-gray.svg"
        class="h-5 w-5 mb-4 self-start cursor-pointer transform scale-x-[-1]"
        @click="(collapsePressed = false), emit('collapse-change', false)"
      />
    </div>
    <div class="flex flex-col flex-1 min-h-0">
      <!-- Collapse sidebar -->
      <div v-if="!isCollapsed" class="flex flex-col items-stretch w-full mb-5">
        <div class="flex items-center gap-2">
          <input
            v-model="variantData.name"
            class="w-full bg-transparent text-neutral-600 font-bold text-2xl truncate"
            type="text"
            placeholder="Untitled Variant"
            @change="updateVariantName"
          />
        </div>
      </div>
      <div
        v-if="!isCollapsed"
        class="flex flex-col min-h-0 flex-1 overflow-hidden"
      >
        <div class="flex space-x-4 mb-4">
          <button
            :class="{
              'border-b-2 border-red-500 text-black':
                selectedOption === 'Details',
              'text-gray-500': selectedOption !== 'Details',
            }"
            class="pb-2 text-lg font-medium"
            @click="selectedOption = 'Details'"
          >
            Details
          </button>
          <button
            :class="{
              'border-b-2 border-red-500 text-black':
                selectedOption === 'Sessions',
              'text-gray-500': selectedOption !== 'Sessions',
            }"
            class="pb-2 text-lg font-medium"
            @click="selectedOption = 'Sessions'"
          >
            Sessions
          </button>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto pr-2">
          <div v-if="selectedOption === 'Details'" class="h-full flex flex-col">
            <div class="mb-2">
              <h2 class="font-bold mb-1">Description</h2>
              <p>{{ variantData.description || "No description" }}</p>
            </div>

            <div class="mb-2">
              <h2 class="font-bold mt-2 mb-1">Type</h2>
              <p>{{ variantData.type || "No type" }}</p>
            </div>
            <div class="mb-2">
              <h2 class="font-bold mt-2 mb-1">Condition Server Code</h2>
              <p>{{ variantData.serverCode || "No server code" }}</p>
            </div>
            <div class="mb-2">
              <h2 class="font-bold mt-2 mb-1">Tags</h2>
              <div class="flex gap-1 flex-wrap">
                <template
                  v-if="
                    Array.isArray(variantData.tags) && variantData.tags.length
                  "
                >
                  <TagLabel
                    v-for="(t, idx) in variantData.tags"
                    :key="idx + '-' + t"
                    :label="t"
                  />
                </template>
                <span v-else class="text-neutral-500 text-sm">No tags</span>
              </div>
            </div>
          </div>
          <div
            v-else-if="selectedOption === 'Sessions'"
            class="flex flex-col min-h-0 overflow-y-auto py-2"
          >
            <Draggable
              v-model="variantData.sessions"
              v-bind="draggableProps"
              :group="{ name: 'sessions', pull: 'clone', put: true }"
              item-key="_id"
              class="min-h-0 overflow-y-auto flex flex-col gap-2"
            >
              <template #item="{ element: session }">
                <SessionCard :key="session._id" :session="session" draggable />
              </template>
            </Draggable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
