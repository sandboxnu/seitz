<script setup lang="ts">
import useImmutable from "@/util/useImmutable.ts";
import AppButton from "./AppButton.vue";

const props = defineProps<{
  visible: boolean;
  header: string;
  subHeader?: string;
}>();
defineEmits(["close"]);

const visibleState = useImmutable(() => props.visible);
</script>

<template>
  <ElDialog
    v-model="visibleState"
    class="rounded-3xl max-h-[500px] overflow-auto"
    width="80%"
    align-center
    :show-close="false"
    @close="$emit('close')"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="flex items-center gap-5 px-5">
        <FontAwesomeIcon
          :icon="['fas', 'xmark']"
          class="w-5 h-5 cursor-pointer"
          @click="close"
        />
        <div class="flex-1">
          <p :id="titleId" :class="['text-xl', titleClass]">{{ header }}</p>
          <p v-if="subHeader" class="font-light">{{ subHeader }}</p>
        </div>
        <AppButton @click="close">Save</AppButton>
      </div>
    </template>
    <slot />
  </ElDialog>
</template>
