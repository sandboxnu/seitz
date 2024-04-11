<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import taskAPI from "@/api/tasks";
import { ElNotification } from "element-plus";
import { useBatteryEditingStore } from "../../../stores/admin.ts";

// const router = useRouter();
// const authStore = useAuthStore();
const queryClient = useQueryClient();
const batteryEditingStore = useBatteryEditingStore();

// if (!authStore.currentUser?.isAdmin) {
//   router.push("/");
// }

// const deleteMutation = useMutation(taskAPI.deleteTask, {
//   onSuccess: () => {
//     queryClient.invalidateQueries(["tasks"]);
//     ElNotification({
//       title: "Success",
//       message: "Battery deleted successfully",
//       type: "success",
//     });
//   },
// });

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
  <h1 class="text-xl px-4 py-2">Task Template Library</h1>
  <div
    class="px-4 py-2 mx-4 my-2 text-black w-36 border border-black rounded-xl font-bold"
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
  <div v-for="task in data" :key="task._id">
    <div
      class="flex flex-wrap border border-black rounded-xl w-96 p-4 my-2 mx-4"
    >
      <ElImage
        :src="task.imageUrl"
        class="w-24 mr-4 rounded-lg cursor-pointer"
        @click="batteryEditingStore.select(task._id)"
      />
      <div class="cursor-pointer" @click="batteryEditingStore.select(task._id)">
        <h2>{{ task.name }}</h2>
        <p class="text-xs w-56">{{ task.description }}</p>
      </div>
      <ElImage
        src="/pepicons-pencil_dots-y.svg"
        class="pb-16 pl-2 cursor-pointer"
      />
      <!-- <AppButton @click="deleteMutation.mutate(task._id)">
          Delete Me! 😲
        </AppButton> -->
    </div>
  </div>
</template>
