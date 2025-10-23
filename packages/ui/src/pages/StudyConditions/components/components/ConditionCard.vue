<script setup lang="ts">
import { computed, ref } from "vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import Draggable from "vuedraggable";
import SessionCard from "./SessionCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { defineProps } from "vue";

// Define props for this component
const props = defineProps<{ variantId: string; draggable: boolean }>();

// Use the study builder store to get your data
const studyBuilderStore = useStudyBuilderStore();

// Get data for the current variant based on the variantId prop
const variantData = computed({
  get: () => {
    return (
      studyBuilderStore.variants.find(
        (variant) => variant._id === props.variantId
      ) || {}
    );
  },
  set(newData) {
    const index = studyBuilderStore.variants.findIndex(
      (variant) => variant._id === props.variantId
    );
    if (index !== -1) {
      studyBuilderStore.variants[index] = {
        ...studyBuilderStore.variants[index],
        ...newData,
      };
    }
  },
});

// Todo: make this actually draggable
const draggableProps = {
  chosenClass: "bg-stone-200",
  dragClass: "bg-stone-200",
  ghostClass: "invisible",
  animation: 100,
};

// Component state: controls whether the container is expanded or collapsed
const isOpen = ref(true);

// Method to toggle the container's state
function toggleContent() {
  isOpen.value = !isOpen.value;
}

function setVariantId() {
  studyBuilderStore.currentVariantId = props.variantId;
}
</script>

<template>
  <div class="w-full flex flex-col overflow-x-hidden px-5 py-2">
    <Transition name="fade" mode="out-in">
      <div
        v-if="isOpen === true"
        v-loading="studyBuilderStore.isStudyLoading"
        class="w-full p-6 bg-neutral-10 border border-neutral-300 rounded-3xl overflow-x-hidden"
        @click="setVariantId"
      >
        <div class="flex items-start justify-between gap-4 pb-3">
          <div class="flex items-center gap-2.5">
            <ElImage
              v-if="props.draggable"
              src="/icons/dropdown-arrow.svg"
              class="handle cursor-pointer align-center"
              @click="toggleContent"
            />
            <header
              class="text-left font-bold text-lg"
              placeholder="Condition Title"
            >
              {{ variantData.name }}
            </header>
          </div>

          <div class="flex items-center gap-2.5">
            <!-- placeholder for variant id -->
            <div class="border rounded px-2 py-1 whitespace-nowrap">
              {{ variantData.serverCode || "00000" }}
            </div>
            <div class="flex items-end justify-end flex-wrap">
              <RouterLink
                :to="{
                  name: 'study',
                  params: { id: studyBuilderStore.studyId },
                }"
              >
                <AppButton>Edit</AppButton>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- placeholder for variant description -->
        <div class="text-neutral-600 font-medium text-sm mb-4">
          {{ variantData.description || "No description" }}
        </div>

        <div class="w-full h-5/6 flex gap-6 overflow-x-auto bg-white pr-5">
          <TransitionGroup>
            <Draggable
              key="draggable"
              v-model="variantData.sessions"
              v-bind="draggableProps"
              class="flex gap-6"
              group="sessions"
              item-key="_id"
              @change="
                (event) => studyBuilderStore.changeVariant(variantId, event)
              "
            >
              <template #item="{ element: session }">
                <SessionCard
                  :key="session._id"
                  :session="session"
                  :draggable="true"
                />
              </template>
            </Draggable>
          </TransitionGroup>
        </div>
      </div>
      <div
        v-else
        v-loading="studyBuilderStore.isStudyLoading"
        class="w-full p-6 bg-neutral-10 border border-neutral-300 rounded-3xl overflow-x-hidden"
        @click="setVariantId"
      >
        <div class="flex items-start justify-between gap-4 pb-5">
          <div class="flex items-center gap-2.5">
            <ElImage
              v-if="props.draggable"
              src="/icons/dropdown-arrow.svg"
              class="handle cursor-pointer align-center"
              @click="toggleContent"
            />
            <header
              class="text-left font-bold text-lg"
              placeholder="Condition Title"
            >
              {{ variantData.name }}
            </header>
            <!--placeholder for description-->
            <div
              class="items-start text-left text-sm overflow-hidden whitespace-nowrap text-ellipsis min-w-0"
              style="max-width: 30vw"
            >
              {{ variantData.description || "No description" }}
            </div>
          </div>

          <div class="flex items-center gap-2.5">
            <!-- placeholder for variant id -->
            <div class="border rounded px-2 py-1 whitespace-nowrap">
              sca-vi1
            </div>
            <div class="flex items-end justify-end flex-wrap">
              <RouterLink
                :to="{
                  name: 'study',
                  params: { id: studyBuilderStore.studyId },
                }"
              >
                <AppButton>Edit</AppButton>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 60%;
}
</style>
