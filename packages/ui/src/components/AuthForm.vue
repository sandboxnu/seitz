<script setup lang="ts">
import { ref } from "vue";
import { ElNotification } from "element-plus";
import SecondaryButton from "../components/ui/SecondaryButton.vue";
import { useRouter } from "vue-router";
import AppButton from "@/components/ui/AppButton.vue";

const router = useRouter();

const props = defineProps({
  hasEmail: Boolean,
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
    class="w-[410px] h-[480px] px-5 rounded-lg my-10 mx-auto bg-neutral-10"
    style="box-shadow: 0 2px 8px 0 rgba(31, 25, 21, 0.2)"
  >
    <h1 class="text-2xl font-bold mt-4">{{ headerText }}</h1>
    <div class="p-2"></div>
    <ElForm label-position="top" @submit.prevent="submit">
      <ElFormItem v-if="hasEmail" label="Email">
        <ElInput v-model="loginData.email" />
      </ElFormItem>
      <ElFormItem label="Username">
        <ElInput v-model="loginData.email" />
      </ElFormItem>
      <ElFormItem label="Password">
        <ElInput v-model="loginData.password" type="password" />
      </ElFormItem>
      <ElFormItem v-if="hasPasswordConfirm" label="Re-enter Password">
        <ElInput v-model="loginData.passwordConfirm" type="password" />
      </ElFormItem>
      <AppButton
        type="primary"
        class="flex py-2 justify-center bg-black text-white w-full border border-black rounded-lg mt-8"
        @click="submit"
      >
        {{ submitText }}
      </AppButton>
      <input type="submit" hidden />
    </ElForm>
  </ElCard>
</template>
