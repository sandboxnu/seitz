<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import authAPI from "@/api/auth";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import AuthForm from "./AuthForm.vue";

import type { AxiosError } from "axios";
import type { LoginDTO } from "@seitz/shared";

const router = useRouter();

const { mutate } = useMutation<void, AxiosError<Error>, LoginDTO>({
  mutationFn: authAPI.logIn,
  onSuccess: async () => {
    router.push("/login");
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
    has-new-password
    header-text="Reset your Account"
    submit-text="Reset"
    @submitted="mutate"
  />
</template>
