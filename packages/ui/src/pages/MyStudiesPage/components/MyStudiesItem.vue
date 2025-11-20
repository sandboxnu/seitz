<script setup lang="ts">
import studiesAPI from "@/api/studies";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { MoreFilled } from "@element-plus/icons-vue";

const router = useRouter();
const emit = defineEmits(["deleted", "open"]);
const props = defineProps<{ name: string; description: string; id: string }>();
const isHovered = ref(false);
const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: () => studiesAPI.deleteStudy(props.id),
  onSuccess: () => {
    queryClient.invalidateQueries(["studies"]);
    emit("deleted");
  },
});

let clickTimer: ReturnType<typeof setTimeout> | null = null;

const handleClick = () => {
  clickTimer = setTimeout(() => {
    emit("open", props.id);
  }, 250);
};

const handleDoubleClick = () => {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
  router.push({ name: "conditions", params: { id: props.id } });
};

const confirmDelete = () => {
  ElMessageBox.confirm("Are you sure you want to delete?", {
    title: "Delete",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    center: true,
    roundButton: true,
    showClose: false,
    customStyle: {
      width: "351px",
      height: "154px",
      borderRadius: "16px",
    },
    customClass: "delete-study-popup",
  }).then(() => {
    mutate();
  });
};

const { mutate: duplicateMutate } = useMutation({
  mutationFn: () => studiesAPI.duplicateStudy(props.id),
  onSuccess: () => {
    queryClient.invalidateQueries(["studies"]);
  },
});
</script>
<template>
  <tr
    class="border-b-2 cursor-pointer transition-colors"
    @click="handleClick"
    @dblclick="handleDoubleClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <td
      :class="[
        'py-4 pl-6 pr-6 max-w-xs transition-colors',
        isHovered ? 'bg-gray-100' : 'bg-white',
      ]"
    >
      <h1 class="whitespace-nowrap text-lg">
        {{ name }}
      </h1>
    </td>
    <td
      :class="[
        'py-4 pl-4 pr-6 max-w-xs transition-colors',
        isHovered ? 'bg-gray-100' : 'bg-white',
      ]"
    >
      <h2 class="text-base text-gray-500 truncate">
        {{ description }}
      </h2>
    </td>
    <td
      :class="[
        'py-4 pl-4 pr-6 max-w-xs transition-colors',
        isHovered ? 'bg-gray-100' : 'bg-white',
      ]"
    >
      <div class="flex gap-2 justify-end whitespace-nowrap">
        <ElDropdown
          trigger="click"
          placement="bottom-end"
          popper-class="action-dropdown"
        >
          <el-icon
            class="three-dots"
            style="transform: rotate(90deg); font-size: 20px"
            @click.stop
            ><MoreFilled
          /></el-icon>
          <template #dropdown>
            <el-dropdown-menu style="width: 129px; background-color: #fcf9f7">
              <el-dropdown-item
                style="
                  color: #594f47;
                  background-color: inherit;
                  height: 41px;
                  font-size: 14px;
                "
                @click="confirmDelete"
                >Delete</el-dropdown-item
              >
              <el-dropdown-item
                style="
                  color: #594f47;
                  background-color: inherit;
                  height: 41px;
                  font-size: 14px;
                "
                @click="duplicateMutate"
                >Duplicate</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </ElDropdown>
      </div>
    </td>
  </tr>
</template>

<style>
.delete-study-popup .el-message-box__title {
  font-size: 24px;
  font-weight: 700;
}
.delete-study-popup .el-button--primary {
  background-color: #1f1915 !important;
  box-shadow: 0px 1px 4px 0px #00000026 !important;
  color: white;
  border: #1f1915;
  border-radius: 10px !important;
  height: 36px;
  width: 107px;
}
.delete-study-popup .el-button:not(.el-button--primary) {
  background-color: #f1edea;
  box-shadow: 0px 1px 4px 0px #00000026;
  color: #594f47;
  border: #e6dfd8;
  border-radius: 10px;
  height: 36px;
  width: 107px;
}
.delete-study-popup .el-message-box__message {
  font-size: 16px;
  font-weight: 400;
}
.action-dropdown .el-dropdown-menu__item:hover {
  background-color: #f7f4f3 !important;
}
.action-dropdown .el-popper__arrow {
  display: none;
}

.action-dropdown {
  border-radius: 8px;
  overflow: hidden;
}
</style>
