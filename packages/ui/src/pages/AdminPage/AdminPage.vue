<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AdminTaskLibrary from "./components/AdminTaskLibrary.vue";
import { ref } from "vue";
import { useMutation } from "@tanstack/vue-query";
import adminAPI from "@/api/admin";
import AppButton from "@/components/ui/AppButton.vue";
import BatteryEditForm from "./components/BatteryEditForm.vue";
import { useBatteryEditingStore } from "../../stores/admin";

const name = ref("");
const router = useRouter();
const authStore = useAuthStore();
const batteryEditingStore = useBatteryEditingStore();
const promoteUser = useMutation(adminAPI.promoteUserToAdmin, {});

if (!authStore.currentUser?.isAdmin) {
  router.push("/");
}
</script>
<template>
  <el-scrollbar>
    <div class="flex">
      <AdminTaskLibrary />
      <ElCard
        class="w-3/4 mx-6 my-8 rounded-2xl h-fit"
        v-if="batteryEditingStore.editingBatteryId !== undefined"
      >
        <BatteryEditForm />
      </ElCard>
    </div>
    <div class="mt-8 mb-4 mx-4">
      <h1 class="text-2xl">Promote User to Admin</h1>
      <ElFormItem label="Email">
        <ElInput v-model="name" />
      </ElFormItem>

      <AppButton @click="promoteUser.mutate(name)">Promote</AppButton>
    </div>
  </el-scrollbar>
</template>
