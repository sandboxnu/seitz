<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import taskAPI, { UploadBattery } from "@/api/tasks";
import AppButton from "@/components/ui/AppButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const queryClient = useQueryClient();

if (!authStore.currentUser?.isAdmin) {
  router.push("/");
}

const { mutate } = useMutation(taskAPI.deleteTask, {
  onSuccess: () => {
    queryClient.invalidateQueries(["tasks"]);
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
    const parsedContent = JSON.parse(content) as UploadBattery;
    taskAPI.uploadBattery(parsedContent);
  };
}
</script>
<template>
  <h1 class="text-2xl">Batteries</h1>
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
    class="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
  >
    Upload File</label
  >
  <div v-for="task in data" :key="task._id" class="border border-black p-4">
    <h2 class="text-xl">{{ task.name }}</h2>
    <p>{{ task.description }}</p>
    <AppButton @click="mutate(task._id)"> Delete Me! 😲 </AppButton>
  </div>
</template>
