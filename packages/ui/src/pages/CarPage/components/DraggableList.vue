<!-- This represents a draggable list component -->

<script setup lang="ts">
import { useDragStore } from "@/stores/drag";
import { ref } from "vue";
import Draggable from "vuedraggable";

const dragStore = useDragStore();

defineProps<{ idx: number }>();

const drag = ref(false);
</script>

<template>
  <Draggable
    v-model="dragStore.lists[idx]"
    group="session-elements"
    item-key="id"
    @start="drag = true"
    @end="drag = false"
  >
    <template #item="{ element }">
      <div class="cursor-pointer">{{ element }}</div>
    </template>
  </Draggable>
</template>
