<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import authAPI from "@/api/auth";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import AuthForm from "./AuthForm.vue";

import type { AxiosError } from "axios";
import { SignupDTO } from "@seitz/shared";

const router = useRouter();
const authStore = useAuthStore();

// if (authStore.currentUser) {
//   router.push("/");
// }

const { mutate } = useMutation<void, AxiosError<Error>, SignupDTO>({
  mutationFn: authAPI.signUp,
  onSuccess: async () => {
    authAPI.getCurrentUser().then((user) => {
      authStore.currentUser = user;
      router.push("/studies");
    });
    ElNotification({
      title: "Success",
      message:
        "Please check your email to verify your account (check spam folder)",
      type: "success",
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
    has-name
    has-password-confirm
    header-text="Create your account"
    submit-text="Sign Up"
    @submitted="mutate"
  />
</template>
