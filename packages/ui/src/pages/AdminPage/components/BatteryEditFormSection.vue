<script setup lang="ts">
import { ref } from "vue";
import adminApi from "@/api/admin";
import type { DTO, IBattery } from "@seitz/shared";

const props = defineProps<{
  group: DTO<IBattery>["stages"][0]["options"];
  batteryId: string;
  stageId: string;
}>();

const isToggled = ref(false);

async function toggleStageRequirement() {
  isToggled.value = !isToggled.value;
  const status = isToggled.value ? "on" : "off";
  try {
    await adminApi.updateStageRequirement(
      props.batteryId,
      props.stageId,
      status
    );
  } catch (error) {
    console.error("Error updating stage requirement:", error);
    isToggled.value = !isToggled.value;
  }
}
</script>

<template>
  <div class="border border-gray-400 rounded-xl p-5">
    <div class="flex items-center gap-2 mb-4">
      <div
        class="ellipseWrapper"
        :style="{ backgroundColor: isToggled ? '#e05846' : '#c3bcb5' }"
        @click="toggleStageRequirement"
      >
        <div class="frameChild" :class="{ active: isToggled }"></div>
      </div>
      <h2 class="text-base font-bold">{{ group.name }}</h2>
    </div>
    <template v-for="option in group.options" :key="option._id">
      <template v-if="option.type == 'dropdown'">
        <ElFormItem :label="option.name" class="block">
          <ElSelect v-model="option.default" placeholder="select option">
            <ElOption
              v-for="(dropdownOption, index) in option.options"
              :key="index"
              :label="dropdownOption"
              :value="index"
            />
          </ElSelect>
        </ElFormItem>
      </template>
      <template v-else-if="option.type == 'number'">
        <ElFormItem :label="option.name" class="block">
          <ElInputNumber
            v-model="option.default"
            :min="option.min"
            :max="option.max"
            :step="option.step"
            placeholder="0"
            class="mr-2"
          />
        </ElFormItem>
      </template>
      <template v-else-if="option.type == 'text'">
        <ElFormItem :label="option.name" class="block">
          <ElInput
            v-model="option.default"
            type="textarea"
            placeholder="type here"
          />
        </ElFormItem>
      </template>
      <template v-else-if="option.type == 'checkbox'">
        <ElFormItem>
          <ElCheckbox
            v-model="option.default"
            :label="option.name"
            size="large"
          />
        </ElFormItem>
      </template>
      <template v-else-if="option.type == 'group'">
        <BatteryEditFormSection
          v-if="option.options.length > 0"
          :group="option"
          :battery-id="batteryId"
          :stage-id="stageId"
          class="my-2"
        />
      </template>
    </template>
  </div>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 0;
}
.ellipseWrapper {
  width: 30px;
  border-radius: 25px;
  background-color: #e05846;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 3px;
  box-sizing: border-box;
}

.frameChild {
  width: 14px;
  position: relative;
  border-radius: 50%;
  background-color: #fffdfd;
  height: 14px;
}

.frameChild.active {
  transform: translateX(10px);
}
</style>
