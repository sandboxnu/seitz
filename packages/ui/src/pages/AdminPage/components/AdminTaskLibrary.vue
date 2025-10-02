<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import taskAPI from "@/api/tasks";
import { ElNotification } from "element-plus";
import { useBatteryEditingStore } from "../../../stores/admin.ts";
import { computed, ref } from "vue";

const queryClient = useQueryClient();
const batteryEditingStore = useBatteryEditingStore();

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

const activeTab = ref("all");

//gets filtered tasks
const filteredTasks = computed(() => {
  if (!data.value) return [];

  switch (activeTab.value) {
    case "favorites":
      return data.value.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => data.favorite === true
      );
    case "recents":
      return data.value
        .slice()
        .sort(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (a: any, b: any) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 0);
    case "all":
    default:
      return data.value;
  }
});

// handles tab switching
const switchTab = (tab: string) => {
  activeTab.value = tab;
};

// // toggles favorite status of battery
// const toggleFavorite = () => {
//   if (batteryData.value) {
//     batteryData.value.favorite = !batteryData.value.favorite;
//   }
// };
</script>
<template>
  <div class="w-[380px] px-8 py-9 rounded-r-2xl h-full bg-white shadow-2xl">
    <div class="flex flex-col gap-8 h-full">
      <h1 class="text-xl font-bold">Task Template Library</h1>
      <!-- Navigation Bar Row -->
      <thead>
        <tr>
          <td colspan="4" class="p-0">
            <div class="flex gap-4">
              <button
                :class="[
                  'px-1 py-1 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'all' ? 'text-black' : 'border-transparent',
                ]"
                :style="
                  activeTab === 'all' ? { borderBottomColor: '#BA3B2A' } : {}
                "
                @click="switchTab('all')"
              >
                All
              </button>
              <button
                :class="[
                  'px-1 py-1 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'recent' ? 'text-black' : 'border-transparent',
                ]"
                :style="
                  activeTab === 'recent' ? { borderBottomColor: '#BA3B2A' } : {}
                "
                @click="switchTab('recent')"
              >
                Recent
              </button>
              <button
                :class="[
                  'px-1 py-1 text-sm font-medium border-b-2 transition-colors',
                  activeTab === 'favorites'
                    ? 'text-black'
                    : 'border-transparent',
                ]"
                :style="
                  activeTab === 'favorites'
                    ? { borderBottomColor: '#BA3B2A' }
                    : {}
                "
                @click="switchTab('favorites')"
              >
                Favorites
              </button>
            </div>
          </td>
        </tr>
      </thead>
      <ElScrollbar>
        <div class="flex-1 flex flex-col gap-4">
          <div v-for="task in filteredTasks" :key="task._id">
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
                  <!-- <ElImage
                    :src="
                      batteryData.favorite
                        ? '/icons/favorite-star.svg'
                        : '/icons/star.svg'
                    "
                    class="h-5 w-5 cursor-pointer"
                    @click="toggleFavorite"
                  /> -->
                </div>
                <div class="text-xs text-neutral-600 font-medium line-clamp-4">
                  {{ task.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ElScrollbar>
      <div
        class="flex py-2 justify-center bg-black text-white w-full border border-black rounded-xl font-bold"
      >
        <input
          id="upload-file"
          type="file"
          name="upload-file"
          accept=".json"
          hidden
          @change="handleFileUpload"
        />
        <label
          for="upload-file"
          refs="upload-file"
          class="flex item-center gap-2 cursor-pointer"
        >
          <ElImage src="/icons/fa6-regular_circle-up.svg" />
          Upload Task</label
        >
      </div>
    </div>
  </div>
</template>
