<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import taskAPI from "@/api/tasks";
import { ElImage, ElNotification } from "element-plus";
import { useBatteryEditingStore } from "../../../stores/admin.ts";
import { ref } from "vue";

const queryClient = useQueryClient();
const batteryEditingStore = useBatteryEditingStore();

const filterMenu = ref(false);

function toggleMenu() {
  filterMenu.value = !filterMenu.value;
}

const uploadMutation = useMutation(taskAPI.uploadBattery, {
  onSuccess: () => {
    queryClient.invalidateQueries(["tasks"]);
    ElNotification({
      title: "Success",
      message: "Battery uploaded successfully",
      type: "success",
    });
  },
  onError: () => {
    ElNotification({
      title: "Error",
      message: "There was an error uploading the battery",
      type: "error",
    });
  },
});

const { data } = useQuery({
  queryKey: ["tasks"],
  queryFn: taskAPI.getAllTasks,
});

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file: File = (target.files as FileList)[0];
  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = (readerEvent) => {
    const content = readerEvent.target?.result as string;
    const parsedContent = JSON.parse(content);
    uploadMutation.mutate(parsedContent);
  };
}
</script>
<template>
  <div class="w-[380px] px-8 py-9 rounded-r-2xl h-full bg-white shadow-2xl">
    <div class="flex flex-col gap-8 h-full">
      <h1 class="text-xl font-bold">Task Template Library</h1>
      <div
        class="flex py-2 ml-20 justify-center text-black w-36 border border-black rounded-xl font-bold"
      >
        <input
          id="upload-file"
          type="file"
          name="upload-file"
          accept=".json"
          hidden
          @change="handleFileUpload"
        />
        <label for="upload-file" refs="upload-file" class="flex cursor-pointer">
          <ElImage src="/material-symbols_upload.svg" />
          Upload File</label
        >
      </div>
      <div>
        <ElImage
          src="/icons/filter.svg"
          class="self-center"
          @click="toggleMenu"
        />
      </div>
      <!-- <div v-if="filterMenu" class="flex gap-2">
        <ElImage src="/icons/unchecked-box.svg" class="self-center" @click="" />
        <ElImage src="/icons/checked-box.svg" class="self-center" @click="" />
      </div> -->
      <ElScrollbar>
        <div class="flex-1 flex flex-col gap-4">
          <div v-for="task in data" :key="task._id">
            <div
              :class="[
                'flex gap-5 p-4 border rounded-2xl cursor-pointer',
                batteryEditingStore.editingBatteryId === task._id
                  ? 'bg-neutral-100 border-neutral-400'
                  : 'bg-neutral-10 border-neutral-300',
              ]"
              @click="batteryEditingStore.select(task._id)"
            >
              <ElImage
                :src="task.imageUrl"
                fit="cover"
                class="flex-none h-24 w-24 rounded-[10px] overflow-hidden"
              />
              <div class="flex-1 flex flex-col gap-3 overflow-hidden">
                <div class="flex">
                  <div class="text-sm text-neutral-600 truncate font-bold">
                    {{ task.name }}
                  </div>
                  <div class="grow"></div>
                  <ElImage
                    src="/pepicons-pencil_dots-y.svg"
                    class="h-5 pl-2 cursor-pointer"
                  />
                </div>
                <div class="text-xs text-neutral-600 font-medium line-clamp-4">
                  {{ task.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>
