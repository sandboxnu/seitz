<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AdminTaskLibrary from "./components/AdminTaskLibrary.vue";
import AppEditModal from "@/components/ui/AppEditModal.vue";
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
  <AdminTaskLibrary></AdminTaskLibrary>
  <AppEditModal
    :visible="batteryEditingStore.editingBatteryId !== undefined"
    header="Edit Battery"
    sub-header="Customize your task's default values"
    @cancel="batteryEditingStore.editingBatteryId = undefined"
    @done="batteryEditingStore.editingBatteryId = undefined"
  >
    <BatteryEditForm />
  </AppEditModal>
</template>
