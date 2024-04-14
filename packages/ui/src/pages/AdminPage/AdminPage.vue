<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import taskAPI from "@/api/tasks";
import adminAPI from "@/api/admin";
import AppButton from "@/components/ui/AppButton.vue";
import { ElNotification } from "element-plus";
import AppEditModal from "@/components/ui/AppEditModal.vue";
import BatteryEditForm from "./components/BatteryEditForm.vue";
import { useBatteryEditingStore } from "../../stores/admin";

const router = useRouter();
const authStore = useAuthStore();
const queryClient = useQueryClient();
const batteryEditingStore = useBatteryEditingStore();

const name = ref("");

if (!authStore.currentUser?.isAdmin) {
  router.push("/");
}

const deleteMutation = useMutation(taskAPI.deleteTask, {
  onSuccess: () => {
    queryClient.invalidateQueries(["tasks"]);
    ElNotification({
      title: "Success",
      message: "Battery deleted successfully",
      type: "success",
    });
  },
});

const promoteUser = useMutation(adminAPI.promoteUserToAdmin, {});

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
    <AppButton @click="batteryEditingStore.select(task._id)">Edit</AppButton>
    <AppButton @click="deleteMutation.mutate(task._id)">
      Delete Me! 😲
    </AppButton>
  </div>
  <AppEditModal
    :visible="batteryEditingStore.editingBatteryId !== undefined"
    header="Edit Battery"
    sub-header="Customize your task's default values"
    @cancel="batteryEditingStore.editingBatteryId = undefined"
    @done="batteryEditingStore.editingBatteryId = undefined"
  >
    <BatteryEditForm />
  </AppEditModal>
  <div class="mt-3">
    <h1 class="text-2xl">Promote User to Admin</h1>
    <ElFormItem label="Email">
      <ElInput v-model="name" />
    </ElFormItem>

    <AppButton @click="promoteUser.mutate(name)">Promote</AppButton>
  </div>
</template>
