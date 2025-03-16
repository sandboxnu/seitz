<script setup lang="ts">
import { ref } from "vue";
import Draggable from "vuedraggable";

const { draggable } = defineProps<{
  draggable: boolean;
}>();

const tasks = ref([
  { _id: "placeholder", name: "placeholder" },
  { _id: "placeholder", name: "placeholder" },
  { _id: "placeholder", name: "placeholder" },
]);

const draggableProps = {
  ghostClass: "invisible",
  animation: 100,
};
</script>

<template>
  <div
    class="flex flex-col px-6 pb-5 border rounded-3xl border-neutral-300 overflow-y-hidden"
  >
    <!-- grip icon for dragging -->
    <ElImage
      v-if="draggable"
      src="/icons/grip-horizontal.svg"
      fit="cover"
      class="handle cursor-pointer self-center mt-2 h-2.5"
    />

    <!-- header for session card -->
    <div class="flex items-center justify-between gap-2.5 mt-3 mb-4">
      <div class="flex items-center gap-2.5">
        <!-- placeholder for image icon -->
        <div
          class="w-8 h-8 bg-neutral-200 border border-neutral-300 rounded"
        ></div>

        <div class="text-neutral-600 font-bold text-base">
          Placeholder Title
        </div>
      </div>

      <ElImage src="/icons/lock.svg" fit="cover" class="w-4 h-4 mr-2" />
    </div>

    <TransitionGroup>
      <Draggable
        v-model="tasks"
        v-bind="draggableProps"
        class="flex-1 flex flex-col gap-2 overflow-y-auto"
        :group="{ name: 'session', put: ['taskbar', 'session'] }"
        item-key="_id"
      >
        <template #item="{ element }">
          <div class="p-2 bg-white rounded">
            {{ element.name }}
          </div>
        </template>
      </Draggable>
    </TransitionGroup>

    <div class="mt-2 text-neutral-500 text-sm text-center">id: sca-hd1</div>
  </div>
</template>
