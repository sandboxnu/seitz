<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import { ref, computed, watch } from "vue";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";

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
  // TODO: Make database update
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
        class="h-5 w-5 mb-4 self-start cursor-pointer"
        style="transform: scaleX(-1)"
        @click="(collapsePressed = false), emit('collapse-change', false)"
      />
    </div>
    <div>
      <!-- Collapse sidebar -->
      <div v-if="!isCollapsed" class="flex flex-col items-stretch w-full mb-5">
        <div class="flex items-center gap-2">
          <input
            v-model="variantData.name"
            class="w-fit bg-transparent text-neutral-600 font-bold text-2xl truncate"
            type="text"
            placeholder="Untitled Variant"
            @change="updateVariantName"
          />
        </div>
      </div>
      <div
        v-if="!isCollapsed"
        class="flex flex-col w-full flex-1 overflow-hidden"
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
        <div class="flex-1 overflow-y-auto">
          <div v-if="selectedOption === 'Details'" class="h-full flex flex-col">
            <div class="mb-2">
              <h2 class="font-bold mb-1">Description</h2>
              <p>{{ variantData.description || "No description" }}</p>
            </div>

            <div class="mb-2">
              <h2 class="font-bold mt-2 mb-1">Type</h2>
              <!-- TODO: not real type, placeholder -->
              <p>hearing impaired condition</p>
            </div>
            <div class="mb-2">
              <h2 class="font-bold mt-2 mb-1">Condition Server Code</h2>
              <p>{{ variantData.serverCode || "No server code" }}</p>
            </div>
            <div class="mb-2">
              <h2 class="font-bold mt-2 mb-1">Tags</h2>
              <div class="flex gap-1 flex-wrap">
                <div
                  class="h-5 p-1 bg-rose-100 rounded outline outline-1 outline-offset-[-1px] outline-red-300 inline-flex justify-center items-center gap-1"
                >
                  <!-- TODO: not real tags, just placeholders -->
                  <img
                    src="/brain.svg"
                    alt="Brain"
                    class="w-3 h-2.5 object-contain"
                  />
                  <div
                    class="justify-center text-orange-700 text-[10px] font-semibold font-['Lato'] leading-3"
                  >
                    Cognitive
                  </div>
                </div>

                <div
                  class="h-5 p-1 bg-rose-100 rounded outline outline-1 outline-offset-[-1px] outline-red-300 inline-flex justify-center items-center gap-1"
                >
                  <!-- TODO: not real tags, just placeholders -->
                  <img
                    src="/vision.svg"
                    alt="Brain"
                    class="w-3 h-2.5 object-contain"
                  />
                  <div
                    class="justify-center text-orange-700 text-[10px] font-semibold font-['Lato'] leading-3"
                  >
                    Vision
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else-if="selectedOption === 'Sessions'"
            class="flex-1 overflow-y-auto flex flex-col"
          >
            <Draggable
              v-model="variantData.sessions"
              v-bind="draggableProps"
              :group="{ name: 'sessions', pull: 'clone', put: true }"
              item-key="_id"
              class="flex flex-col gap-2"
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
