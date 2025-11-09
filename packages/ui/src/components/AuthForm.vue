<script setup lang="ts">
import { ref } from "vue";
import { ElNotification } from "element-plus";
import SecondaryButton from "../components/ui/SecondaryButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  hasName: Boolean,
  hasPasswordConfirm: Boolean,
  headerText: {
    type: String,
    required: true,
  },
  submitText: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["submitted"]);

const loginData = ref({
  name: "",
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
  <header class="flex justify-between items-center px-12 py-10">
    <h1
      class="text-2xl font-semibold cursor-pointer"
      @click="router.push('/home')"
    >
      Brain Game Center
    </h1>
    <SecondaryButton
      v-if="hasPasswordConfirm"
      class="px-8"
      @click="router.push('/login')"
      >Login</SecondaryButton
    >
    <SecondaryButton
      v-if="!hasPasswordConfirm"
      class="px-8"
      @click="router.push('/signup')"
      >Signup</SecondaryButton
    >
  </header>
  <ElCard
    shadow="never"
    class="w-[380px] h-[480px] px-5 rounded-lg my-10 mx-auto text-center bg-neutral-10"
    style="box-shadow: 0 2px 8px 0 rgba(31, 25, 21, 0.2)"
  >
    <h1 class="text-2xl font-bold">{{ headerText }}</h1>
    Welcome to the Brain Game Center
    <div class="p-2"></div>
    <ElForm label-position="top" @submit.prevent="submit">
      <ElFormItem v-if="hasName" label="Name">
        <ElInput v-model="loginData.name" />
      </ElFormItem>
      <ElFormItem label="Email">
        <ElInput v-model="loginData.email" />
      </ElFormItem>
      <ElFormItem label="Password">
        <ElInput v-model="loginData.password" type="password" />
      </ElFormItem>
      <ElFormItem v-if="hasPasswordConfirm" label="Re-enter Password">
        <ElInput v-model="loginData.passwordConfirm" type="password" />
      </ElFormItem>
      <ElButton type="primary" class="bg-sky-800" @click="submit">
        {{ submitText }}
      </ElButton>
      <input type="submit" hidden />
    </ElForm>
  </ElCard>
</template>
