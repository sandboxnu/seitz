<!-- This component allows admins to promote a user to an admin role by submitting their email address. -->
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import adminAPI from "@/api/admin";
import AppButton from "@/components/ui/AppButton.vue";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const promoteUser = useMutation(adminAPI.promoteUserToAdmin, {});

if (!authStore.currentUser?.isAdmin) {
  router.push("/");
}
</script>

<template>
  <div class="mt-8 mb-4 mx-4">
    <h1 class="text-2xl">Promote User to Admin</h1>
    <ElFormItem label="Email">
      <ElInput v-model="name" />
    </ElFormItem>

    <AppButton @click="promoteUser.mutate(name)">Promote</AppButton>
  </div>
</template>
