<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { ref } from "vue";
import authAPI from "@/api/auth";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";

const router = useRouter();

const { mutate } = useMutation({
  mutationFn: authAPI.logIn,
  onSuccess: async () => {
    router.push("/");
  },
  onError: (err) => {
    ElNotification({
      title: "Error",
      message: err.response.data,
      type: "error",
    });
  },
});

const loginData = ref({
  email: "",
  password: "",
});
</script>

<template>
  <ElCard
    shadow="never"
    class="max-w-md my-10 mx-auto text-center bg-neutral-100"
  >
    <h1 class="text-2xl font-bold">Log In</h1>
    Welcome to the Brain Game Center
    <div class="p-2"></div>
    <ElForm label-position="top">
      <ElFormItem label="Email">
        <ElInput v-model="loginData.email" />
      </ElFormItem>
      <ElFormItem label="Password">
        <ElInput v-model="loginData.password" type="password" />
      </ElFormItem>
      <ElButton type="primary" class="bg-sky-800" @click="mutate(loginData)">
        Submit
      </ElButton>
    </ElForm>
  </ElCard>
</template>
