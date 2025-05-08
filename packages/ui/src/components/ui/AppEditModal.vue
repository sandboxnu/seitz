<!-- This component represents a customizable modal with a header, optional subheader, and slot. */ -->
<script setup lang="ts">
import useImmutable from "@/util/useImmutable";
import AppButton from "./AppButton.vue";

const props = defineProps<{
  visible: boolean;
  header?: string;
  subHeader?: string;
}>();
defineEmits(["cancel", "done"]);

const visibleState = useImmutable(() => props.visible);
</script>

<template>
  <ElDialog
    id="edit-modal"
    v-model="visibleState"
    class="rounded-3xl min-h-[400px] h-5/6 overflow-hidden flex flex-col"
    width="80%"
    align-center
    :show-close="false"
    @close="$emit('cancel')"
  >
    <template #header="{ titleId, titleClass }">
      <div
        class="flex items-center gap-5 px-5 py-3 border-b border-neutral-300"
      >
        <FontAwesomeIcon
          :icon="['fas', 'xmark']"
          class="w-5 h-5 cursor-pointer"
          @click="$emit('cancel')"
        />
        <div class="flex-1">
          <p
            :id="titleId"
            :class="['text-xl', 'text-black', 'font-bold', titleClass]"
          >
            {{ header }}
          </p>
          <p v-if="subHeader" class="font-light">{{ subHeader }}</p>
        </div>
        <AppButton @click="$emit('done')">Done</AppButton>
      </div>
    </template>
    <slot />
  </ElDialog>
</template>

<style>
#edit-modal {
  --el-text-color-regular: black;
}

.el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
