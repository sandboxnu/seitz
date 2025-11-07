<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import authAPI from "@/api/auth";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import AuthForm from "./AuthForm.vue";

import type { AxiosError } from "axios";
import type { LoginDTO } from "@seitz/shared";

const router = useRouter();
const authStore = useAuthStore();

// if (authStore.currentUser) {
//   router.push("/");
// }

const { mutate } = useMutation<void, AxiosError<Error>, LoginDTO>({
  mutationFn: authAPI.logIn,
  onSuccess: async () => {
    authAPI.getCurrentUser().then((user) => {
      authStore.currentUser = user;
      router.push("/studies");
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
    header-text="Log in to your account"
    submit-text="Log In"
    @submitted="mutate"
  />
</template>
