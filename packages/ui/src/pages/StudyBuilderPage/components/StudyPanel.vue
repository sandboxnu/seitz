<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import AppButton from "@/components/ui/AppButton.vue";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";
import StudyServerCode from "./StudyServerCode.vue";
import { ref } from "vue";

const studyBuilderStore = useStudyBuilderStore();
const currentVariantIndex = ref(0);

const switchVariantByIndex = (index: number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variant = studyBuilderStore.variants[index] as any;
  if (variant) {
    studyBuilderStore.switchVariant(variant._id);
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
    <div class="flex items-start justify-between gap-4 p-5">
      <div class="flex-1">
        <el-carousel
          v-model="currentVariantIndex"
          autoplay="false"
          interval="0"
          trigger="click"
          height="40px"
          @change="switchVariantByIndex"
        >
          <el-carousel-item
            v-for="variant in studyBuilderStore.variants"
            :key="(variant as any)._id"
          >
            <input
              v-model="studyBuilderStore.variantName"
              class="text-center w-full bg-transparent text-neutral-600 font-medium text-lg"
              type="text"
              placeholder="Untitled Variant"
            />
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="flex gap-2 items-end justify-end min-w-[200px] flex-wrap">
        <StudyServerCode class="shrink grow-0 min-w-0" />
        <AppButton class="flex-none" @click="studyBuilderStore.saveStudyStore">
          Save Changes
        </AppButton>
      </div>
    </div>
    <div
      v-loading="studyBuilderStore.isStudyLoading"
      class="grow p-6 bg-neutral-10 border border-neutral-300 rounded-3xl overflow-x-hidden"
    >
      <div class="w-full h-full flex gap-6 overflow-x-auto bg-white">
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
        <div
          class="h-[30px] w-[30px] rounded-3xl bg-primary-300 border-primary-400 self-center cursor-pointer flex items-center justify-center"
          @click="studyBuilderStore.addSession"
        >
          <ElImage src="/icons/plus.svg" />
        </div>
      </div>
    </div>
  </div>
</template>
