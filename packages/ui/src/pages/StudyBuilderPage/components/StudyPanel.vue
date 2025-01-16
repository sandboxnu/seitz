<!--  This component serves as the study builder interface, allowing users to manage conditions and sessions for a study with features for adding, switching, and deleting conditions, and reordering sessions within the study. -->

<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import AppButton from "@/components/ui/AppButton.vue";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";
import StudyServerCode from "./StudyServerCode.vue";
import { ref } from "vue";
import { ArrowRight, ArrowLeft, Plus, Delete } from "@element-plus/icons-vue";

const studyBuilderStore = useStudyBuilderStore();
const currentVariantIndex = ref(0);

const switchVariantByIndex = (index: number) => {
  const variant = studyBuilderStore.variants[index];
  if (variant) {
    studyBuilderStore.switchVariant(variant._id);
  }
};

const switchVariant = (direction: "next" | "prev") => {
  if (
    direction === "next" &&
    currentVariantIndex.value < studyBuilderStore.variants.length - 1
  ) {
    currentVariantIndex.value++;
  } else if (direction === "prev" && currentVariantIndex.value > 0) {
    currentVariantIndex.value--;
  }
  switchVariantByIndex(currentVariantIndex.value);
};

const addVariant = () => {
  studyBuilderStore.addVariant();
  currentVariantIndex.value = studyBuilderStore.variants.length - 1;
};

const deleteVariant = () => {
  studyBuilderStore.deleteVariant();
  if (currentVariantIndex.value > 0) {
    currentVariantIndex.value = currentVariantIndex.value - 1;
  } else {
    currentVariantIndex.value = 0;
  }
};

const draggableProps = {
  chosenClass: "bg-gray-200",
  dragClass: "bg-gray-200",
  ghostClass: "invisible",
  handle: ".handle",
  animation: 200,
};
</script>

<template>
  <div class="flex flex-col overflow-x-hidden p-5">
    <div class="flex items-center gap-2 mb-2">
      <div class="flex-1">
        <ElSkeleton animated :loading="studyBuilderStore.isStudyLoading">
          <template #template>
            <ElSkeletonItem variant="text" class="h-11 w-1/2" />
            <ElSkeletonItem variant="text" class="h-8 mt-2 mb-1 w-3/4" />
          </template>
          <template #default>
            <div class="flex gap-3 flex-col">
              <input
                v-model="studyBuilderStore.name"
                class="w-full bg-transparent text-neutral-600 font-bold text-4xl"
                type="text"
                placeholder="Untitled Study"
              />
              <input
                v-model="studyBuilderStore.description"
                class="w-full bg-transparent text-neutral-600 font-medium text-lg"
                type="text"
                placeholder="Add a description"
              />
            </div>
          </template>
        </ElSkeleton>
      </div>
    </div>
    <div class="flex items-center justify-center w-3/6 p-2 mx-auto">
      <el-button
        :icon="ArrowLeft"
        :disabled="currentVariantIndex <= 0"
        @click="switchVariant('prev')"
      />
      <input
        v-model="studyBuilderStore.variantName"
        class="text-center w-full bg-transparent text-neutral-600 font-medium text-lg mx-5"
        type="text"
        placeholder="Untitled Variant"
      />
      <el-button
        v-if="currentVariantIndex < studyBuilderStore.variants.length - 1"
        :icon="ArrowRight"
        :disabled="currentVariantIndex >= studyBuilderStore.variants.length - 1"
        @click="switchVariant('next')"
      />
      <el-button v-else :icon="Plus" @click="addVariant()" />
      <el-button class="ml-8" :icon="Delete" @click="deleteVariant()" />
    </div>

    <div
      v-loading="studyBuilderStore.isStudyLoading"
      class="grow p-6 bg-neutral-10 border border-neutral-300 rounded-3xl overflow-x-hidden"
    >
      <div class="flex items-start items-center justify-between gap-4 pb-5">
        <div></div>
        <div class="flex gap-2 items-end justify-end min-w-[200px] flex-wrap">
          <StudyServerCode class="shrink grow-0 min-w-0" />
          <AppButton
            class="flex-none"
            @click="studyBuilderStore.saveStudyStore"
          >
            Save Changes
          </AppButton>
        </div>
      </div>

      <div class="w-full h-5/6 flex gap-6 overflow-x-auto bg-white pr-5">
        <TransitionGroup>
          <Draggable
            key="draggable"
            v-model="studyBuilderStore.sessions"
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
        <el-button
          class="h-[30px] w-[30px] bg-primary-300 text-white border border-primary-400 self-center cursor-pointer flex"
          circle
          @click="studyBuilderStore.addSession"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </el-button>
      </div>
    </div>
  </div>
</template>
