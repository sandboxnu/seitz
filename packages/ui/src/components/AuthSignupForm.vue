<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import authAPI, { LogInDto } from "@/api/auth";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import AuthForm from "./AuthForm.vue";

import type { AxiosError } from "axios";

const router = useRouter();
const authStore = useAuthStore();

if (authStore.currentUser) {
  router.push("/");
}

const { mutate } = useMutation<void, AxiosError<Error>, LogInDto>({
  mutationFn: authAPI.signUp,
  onSuccess: async () => {
    authAPI.getCurrentUser().then((user) => {
      authStore.currentUser = user;
      router.push("/");
    });
  },
  onError: (err) => {
    ElNotification({
      title: "Error",
      message: err.response?.data.message ?? "",
      type: "error",
    });
  },
});
</script>

<template>
  <AuthForm
    has-password-confirm
    @submitted="mutate"
    header-text="Create your account"
  />
</template>
