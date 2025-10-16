<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import taskAPI from "@/api/tasks";
import { ElImage, ElNotification } from "element-plus";
import { useBatteryEditingStore } from "../../../stores/admin.ts";
import { computed, ref } from "vue";
import adminAPI from "@/api/admin";
import authAPI from "@/api/auth";

const queryClient = useQueryClient();
const batteryEditingStore = useBatteryEditingStore();

const filterMenu = ref(false);
const showUnpublished = ref(true);
const showPublished = ref(true);

function toggleMenu() {
  filterMenu.value = !filterMenu.value;
}

function toggleUnpublished() {
  showUnpublished.value = !showUnpublished.value;
}

function togglePublished() {
  showPublished.value = !showPublished.value;
}

const filteredTasks = computed(() => {
  let tasks = data.value;
  if (!tasks) return [];

  switch (activeTab.value) {
    case "favorites":
      tasks = tasks.filter(
        (battery) =>
          currentUser.value?.favoriteBatteries?.some(
            (favId) => favId.toString() === battery._id?.toString()
          )
      );
      break;
    case "recent":
      queryClient.invalidateQueries(["tasks", "recent"]);
      tasks = recentBatteries.value || [];
      break;
  }
  // Filter by published status
  if (!showUnpublished.value && !showPublished.value) {
    return [];
  }
  if (showUnpublished.value && showPublished.value) {
    return tasks;
  }
  return tasks.filter((task) => {
    if (showPublished.value) return task.published === true;
    if (showUnpublished.value) return task.published === false;
  });
});

const favoriteMutation = useMutation({
  mutationFn: ({ userId, batteryId }: { userId: string; batteryId: string }) =>
    adminAPI.toggleFavoriteBattery(userId, batteryId),
  onSuccess: () => {
    queryClient.invalidateQueries(["user"]);
  },
});

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

const activeTab = ref("all");

const { data } = useQuery({
  queryKey: ["tasks"],
  queryFn: taskAPI.getAllTasks,
});

const { data: currentUser } = useQuery({
  queryKey: ["user"],
  queryFn: authAPI.getCurrentUser,
});

const { data: recentBatteries } = useQuery({
  queryKey: ["tasks", "recent"],
  queryFn: () => adminAPI.recentBatteries(currentUser.value?._id || ""),
});

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file: File = (target.files as FileList)[0];
  const reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = (readerEvent) => {
    const content = readerEvent.target?.result as string;
    const parsedContent = JSON.parse(content);
    uploadMutation.mutate({ userId: currentUser.value?._id, ...parsedContent });
  };
}

const switchTab = (tab: string) => {
  activeTab.value = tab;
};
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
              <div class="relative inline-block">
                <ElImage
                  src="/icons/filter.svg"
                  class="self-center"
                  @click="toggleMenu"
                />
                <div
                  v-if="filterMenu"
                  class="absolute top-full -translate-x-[-6px] -translate-y-[12px] z-50 flex flex-col gap-2 rounded-lg bg-white shadow-[0_2px_8px_rgba(15,20,31,0.15)] p-3 w-[140px]"
                >
                  <div
                    class="flex items-center gap-2 cursor-pointer"
                    @click="toggleUnpublished"
                  >
                    <ElImage
                      :src="
                        showUnpublished
                          ? '/icons/checked-box.svg'
                          : '/icons/unchecked-box.svg'
                      "
                      class="self-center"
                    />Unpublished
                  </div>
                  <div
                    class="flex items-center gap-2 cursor-pointer"
                    @click="togglePublished"
                  >
                    <ElImage
                      :src="
                        showPublished
                          ? '/icons/checked-box.svg'
                          : '/icons/unchecked-box.svg'
                      "
                      class="self-center"
                    />Published
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </thead>
      <ElScrollbar>
        <div class="flex-1 flex flex-col gap-4">
          <div v-for="task in filteredTasks" :key="task._id.toString()">
            <div
              :class="[
                'flex gap-5 p-4 border rounded-2xl cursor-pointer',
                batteryEditingStore.editingBatteryId === task._id.toString()
                  ? 'bg-neutral-100 border-neutral-400'
                  : 'bg-neutral-10 border-neutral-300',
              ]"
              @click="batteryEditingStore.select(task._id.toString())"
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
                    :src="
                      currentUser?.favoriteBatteries?.some(
                        (t) => t.toString() === task._id.toString()
                      )
                        ? '/icons/favorite-star.svg'
                        : '/icons/star.svg'
                    "
                    class="h-5 w-5 cursor-pointer"
                    @click="
                      currentUser?._id &&
                        task._id &&
                        favoriteMutation.mutate({
                          userId: currentUser._id,
                          batteryId: task._id.toString(),
                        })
                    "
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
