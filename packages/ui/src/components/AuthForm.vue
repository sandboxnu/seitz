<script setup lang="ts">
import { ref } from "vue";
import { ElNotification } from "element-plus";

const props = defineProps({
  hasPasswordConfirm: Boolean,
  headerText: String,
});

const emit = defineEmits(["submitted"]);

const loginData = ref({
  email: "",
  password: "",
  passwordConfirm: "",
});

function submit() {
  if (
    props.hasPasswordConfirm &&
    loginData.value.password !== loginData.value.passwordConfirm
  ) {
    ElNotification({
      title: "Error",
      message: "Passwords must match",
      type: "error",
    });
  } else {
    emit("submitted", loginData.value);
  }
}
</script>

<template>
  <ElCard
    shadow="never"
    class="max-w-md my-10 mx-auto text-center bg-neutral-100"
  >
    <h1 class="text-2xl font-bold">{{ headerText }}</h1>
    Welcome to the Brain Game Center
    <div class="p-2"></div>
    <ElForm label-position="top" @submit.prevent="submit">
      <ElFormItem label="Email">
        <ElInput v-model="loginData.email" />
      </ElFormItem>
      <ElFormItem label="Password">
        <ElInput v-model="loginData.password" type="password" />
      </ElFormItem>
      <ElFormItem v-if="hasPasswordConfirm" label="Re-enter Password">
        <ElInput v-model="loginData.passwordConfirm" type="password" />
      </ElFormItem>
      <ElButton type="primary" class="bg-sky-800" @click="submit"
        >Submit</ElButton
      >
      <input type="submit" hidden />
    </ElForm>
  </ElCard>
</template>
