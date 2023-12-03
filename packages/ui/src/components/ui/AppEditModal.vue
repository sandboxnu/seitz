<script setup lang="ts">
import useImmutable from "@/util/useImmutable";
import AppButton from "./AppButton.vue";

const props = defineProps<{
  visible: boolean;
  header?: string;
  subHeader?: string;
}>();
defineEmits(["cancel", "save"]);

const visibleState = useImmutable(() => props.visible);
</script>

<template>
  <ElDialog
    v-model="visibleState"
    class="rounded-3xl max-h-[500px] overflow-hidden flex flex-col"
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
        <AppButton @click="$emit('save')">Save</AppButton>
      </div>
    </template>
    <slot />
  </ElDialog>
</template>

<style>
.el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
