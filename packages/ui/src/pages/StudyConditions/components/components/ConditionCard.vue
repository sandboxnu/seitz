<script setup lang="ts">
import { ref } from "vue";
import { useStudyBuilderStore } from "@/stores/studyBuilder";
import Draggable from "vuedraggable";
import SessionCard from "./SessionCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { Plus } from "@element-plus/icons-vue";

const studyBuilderStore = useStudyBuilderStore();

const currentSessionIndex = ref(0);

const addSession = () => {
  studyBuilderStore.addSession();
  currentSessionIndex.value = studyBuilderStore.sessions.length - 1;
};

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
          class="text-left w-full bg-transparent font-medium text-xl"
          type="text"
          placeholder="Condition Title"
        />

        <el-button
          class="flex items-end justify-end flex-wrap"
          :icon="Plus"
          @click="addSession()"
        />
        <div class="border rounded px-2 py-1 whitespace-nowrap">sca-hd1</div>
        <div class="flex items-end justify-end flex-wrap">
          <AppButton> Edit </AppButton>
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
          @click="addSession"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </el-button>
      </div>
    </div>
  </div>
</template>
