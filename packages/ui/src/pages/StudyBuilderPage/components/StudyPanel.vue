<script setup lang="ts">
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import studiesAPI from "@/api/studies";
import AppButton from "@/components/ui/AppButton.vue";
import SessionCard from "./SessionCard.vue";
import Draggable from "vuedraggable";
import StudyServerCode from "./StudyServerCode.vue";
import { ref, watch } from "vue";
import { ArrowRight, ArrowLeft, Plus, Delete } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import authAPI from "@/api/auth";
import { useQueryClient, useQuery } from "@tanstack/vue-query";

const studyBuilderStore = useStudyBuilderStore();
const route = useRoute();
const currentVariantIndex = ref(0);
const queryClient = useQueryClient();
const { data: currentUser } = useQuery({
  queryKey: ["user"],
  queryFn: authAPI.getCurrentUser,
});

const updateWizardSteps = async (step: number) => {
  await authAPI.updateCurrentUser({ welcomeWizardStep: step });
  await queryClient.invalidateQueries(["user"]);
};

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

// Sync local index with store.currentVariantId when variants load or change
watch(
  () => [studyBuilderStore.variants, studyBuilderStore.currentVariantId],
  () => {
    if (!studyBuilderStore.currentVariantId) return;
    const idx = studyBuilderStore.variants.findIndex(
      (v) => v._id === studyBuilderStore.currentVariantId
    );
    if (idx !== -1 && idx !== currentVariantIndex.value) {
      currentVariantIndex.value = idx;
    }
  },
  { immediate: true, deep: true }
);

// Align with the desired variantId from the route (if any)
watch(
  () => [studyBuilderStore.variants.length, route.query.variantId],
  () => {
    const queriedVariant = Array.isArray(route.query.variantId)
      ? route.query.variantId[0]
      : typeof route.query.variantId === "string"
      ? route.query.variantId
      : undefined;
    if (!queriedVariant) return;
    const exists = studyBuilderStore.variants.some(
      (v) => v._id === queriedVariant
    );
    if (!exists) return;
    if (studyBuilderStore.currentVariantId !== queriedVariant) {
      studyBuilderStore.switchVariant(queriedVariant);
    }
  },
  { immediate: true }
);

const downloadExport = async () => {
  const id = studyBuilderStore.studyId;
  if (!id) return;
  try {
    await studiesAPI.downloadStudyExport(id);
  } catch (err) {
    console.error("Failed to download study export:", err);
  }
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
            <div class="flex flex-row items-start justify-between">
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
              <AppButton
                class="flex-none"
                :disabled="!studyBuilderStore.studyId"
                @click="downloadExport"
              >
                Export
              </AppButton>
            </div>
          </template>
        </ElSkeleton>
      </div>
    </div>
    <div class="flex items-center justify-center w-3/6 p-2 mx-auto">
      <el-button
        class="rounded-lg px-2"
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
        class="rounded-lg px-2"
        :icon="ArrowRight"
        :disabled="currentVariantIndex >= studyBuilderStore.variants.length - 1"
        @click="switchVariant('next')"
      />
      <el-button v-else :icon="Plus" @click="addVariant()" />
      <el-button
        class="ml-8 rounded-lg px-3"
        :icon="Delete"
        @click="deleteVariant()"
      />
    </div>

    <div
      v-loading="studyBuilderStore.isStudyLoading"
      class="grow p-6 bg-neutral-10 border border-neutral-200 rounded-3xl overflow-x-hidden"
    >
      <div class="flex-2 items-center justify-between gap-4 pb-5">
        <input
          v-model="studyBuilderStore.variantDescription"
          class="text-center w-full bg-transparent text-neutral-600 font-medium text-md"
          type="text"
          placeholder="Untitled Variant Description"
        />
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

      <div
        class="w-full h-fill min-h-[300px] flex gap-6 overflow-x-auto bg-white pr-5"
      >
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
        <el-popover
          :visible="currentUser?.welcomeWizardStep == 1"
          teleported="false"
          title="Add a Session"
          placement="left-start"
          width="293px"
          popper-style="border-radius: 10px;"
          :hide-after="0"
          trigger="manual"
        >
          <template #default>
            A new study has no sessions. Click the plus button to add a new
            session.
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;
              "
            >
              <el-button
                class="close-tip"
                style="
                  width: 59px;
                  height: 36px;
                  border-radius: 10px;
                  border-width: 1px;
                  border-color: #c3bcb5;
                  background-color: #fffdfd;
                  font-size: 14px;
                  font-weight: 700;
                "
                @click="
                  updateWizardSteps((currentUser?.welcomeWizardStep ?? 0) + 1)
                "
                >Close</el-button
              >
              <div style="font-weight: 500; font-size: 14px">2/3</div>
              <el-button
                type="text"
                style="font-size: 14px; font-weight: 500; color: #8a7f75"
                @click="updateWizardSteps(3)"
                >Skip all tips</el-button
              >
            </div>
          </template>
          <template #reference>
            <el-button
              class="h-[30px] w-[30px] bg-primary-300 text-white border border-primary-400 self-center cursor-pointer flex"
              circle
              @click="studyBuilderStore.addSession"
            >
              <font-awesome-icon :icon="['fas', 'plus']" />
            </el-button>
          </template>
        </el-popover>
        <div
          v-if="currentUser?.welcomeWizardStep == 1"
          style="
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<style>
.close-tip:hover {
  background-color: #e0e0e0 !important;
  color: inherit !important;
}
.close-tip:focus {
  color: inherit;
}
</style>
