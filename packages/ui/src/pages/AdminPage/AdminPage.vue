<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AdminTaskLibrary from "./components/AdminTaskLibrary.vue";
import BatteryEditForm from "./components/BatteryEditForm.vue";
import { useBatteryEditingStore } from "../../stores/admin";

const router = useRouter();
const authStore = useAuthStore();
const batteryEditingStore = useBatteryEditingStore();

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
  </el-scrollbar>
</template>
