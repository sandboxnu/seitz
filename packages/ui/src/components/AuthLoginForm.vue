<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import authAPI from "@/api/auth";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import AuthForm from "./AuthForm.vue";

const router = useRouter();
const authStore = useAuthStore();

const { mutate } = useMutation({
  mutationFn: authAPI.logIn,
  onSuccess: async () => {
    authAPI.getCurrentUser().then((user) => {
      authStore.currentUser = user;
      router.push("/");
    });
  },
  onError: (err) => {
    ElNotification({
      title: "Error",
      message: err.response.data,
      type: "error",
    });
  },
});
</script>

<template>
  <AuthForm @submitted="mutate" header-text="Login to your account" />
</template>
