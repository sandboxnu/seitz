<script setup lang="ts">
import { computed } from "vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import Draggable from "vuedraggable";
import SessionCard from "./SessionCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { defineProps } from "vue";

const studyBuilderStore = useStudyBuilderStore();
const props = defineProps<{ variantId: string }>();

//get data for the current variant based on the variantId prop
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

//todo: make this actually draggable
const draggableProps = {
  ghostClass: "invisible",
  animation: 100,
};
</script>

<template>
  <div class="flex flex-col overflow-x-hidden p-5">
    <div
      v-loading="studyBuilderStore.isStudyLoading"
      class="grow p-6 bg-neutral-10 border border-neutral-300 rounded-3xl overflow-x-hidden"
    >
      <div class="flex items-start justify-between gap-4 pb-5">
        <ElImage
          src="/icons/grip-vertical.svg"
          class="handle cursor-pointer h-4 w-4"
        />
        <input
          v-model="variantData.name"
          class="text-left w-full bg-transparent font-medium text-xl"
          type="text"
          placeholder="Condition Title"
        />

        <div class="border rounded px-2 py-1 whitespace-nowrap">
          {{ variantId }}
        </div>
        <div class="flex items-end justify-end flex-wrap">
          <RouterLink :to="{ name: 'study', params: { id } }">
            <AppButton>Edit</AppButton>
          </RouterLink>
        </div>
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
          >
            <template #item="{ element: sessionId, index }">
              <SessionCard
                :session-id="sessionId"
                :index="index + 1"
                draggable
                class="w-[264px] shrink-0"
              />
            </template>
          </Draggable>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>
