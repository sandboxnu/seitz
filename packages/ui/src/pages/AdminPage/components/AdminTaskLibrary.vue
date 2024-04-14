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
  <el-card class="w-1/4 p-2 rounded-r-2xl h-fit">
    <h1 class="text-xl font-bold">Task Template Library</h1>
    <div
      class="flex py-2 mt-4 mb-6 ml-20 justify-center text-black w-36 border border-black rounded-xl font-bold"
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
      <div class="flex border border-black rounded-xl p-4 my-4">
        <ElImage
          :src="task.imageUrl"
          fit="cover"
          class="w-24 h-24 mr-4 rounded-lg cursor-pointer"
          @click="batteryEditingStore.select(task._id)"
        />
        <div
          class="w-44 overflow-hidden break-words cursor-pointer"
          @click="batteryEditingStore.select(task._id)"
        >
          <h2 class="font-bold">{{ task.name }}</h2>
          <p class="text-xs">{{ task.description }}</p>
        </div>
        <ElImage
          src="/pepicons-pencil_dots-y.svg"
          class="h-5 pl-2 cursor-pointer"
        />
        <!-- <AppButton @click="deleteMutation.mutate(task._id)">
          Delete Me! 😲
        </AppButton> -->
      </div>
    </div>
  </el-card>
</template>
