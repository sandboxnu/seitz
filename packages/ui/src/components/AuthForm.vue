<script setup lang="ts">
import { ref } from "vue";
import { ElNotification } from "element-plus";
import SecondaryButton from "../components/ui/SecondaryButton.vue";
import { useRouter } from "vue-router";
import AppButton from "@/components/ui/AppButton.vue";

const router = useRouter();

const props = defineProps({
  hasEmail: Boolean,
  hasName: Boolean,
  hasPasswordConfirm: Boolean,
  hasNewPassword: Boolean,
  hasCode: Boolean,
  hasOnlyEmail: Boolean,
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
  firstName: "",
  lastName: "",
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
    class="w-[410px] h-[520px] px-5 rounded-lg my-6 ml-12 bg-neutral-10 z-10"
    style="box-shadow: 0 2px 8px 0 rgba(31, 25, 21, 0.2)"
  >
    <h1 class="text-2xl font-bold mt-4">{{ headerText }}</h1>
    <p v-if="hasCode" class="text-sm font-bold mt-4 mb-2">
      A verification code was sent to your email.
    </p>
    <p v-if="hasOnlyEmail" class="text-sm font-bold mt-4 mb-2">
      Enter the email tied to your account.
    </p>

    <div class="p-2"></div>
    <ElForm label-position="top" @submit.prevent="submit">
      <div v-if="hasName" class="flex gap-4">
        <ElFormItem class="flex-1">
          <template #label>
            <span class="text-neutral-400">First name</span>
          </template>
          <ElInput v-model="loginData.firstName" />
        </ElFormItem>
        <ElFormItem class="flex-1">
          <template #label>
            <span class="text-neutral-400">Last name</span>
          </template>
          <ElInput v-model="loginData.lastName" />
        </ElFormItem>
      </div>

      <ElFormItem v-if="!hasCode">
        <template #label>
          <span class="text-neutral-400">Email</span>
        </template>
        <ElInput v-model="loginData.email" />
      </ElFormItem>

      <ElFormItem v-if="!hasNewPassword && !hasCode && !hasOnlyEmail">
        <template #label>
          <span class="text-neutral-400">Password</span>
        </template>
        <ElInput v-model="loginData.password" type="password" />
      </ElFormItem>
      <p
        v-if="
          !hasPasswordConfirm && !hasNewPassword && !hasCode && !hasOnlyEmail
        "
        class="text-right text-xs text-neutral-400 -mt-2 cursor-pointer"
        @click="router.push('/reset-password')"
      >
        Forgot Password?
      </p>

      <ElFormItem v-if="hasPasswordConfirm && !hasNewPassword">
        <template #label>
          <span class="text-neutral-400">Re-enter Password</span>
        </template>
        <ElInput v-model="loginData.passwordConfirm" type="password" />
      </ElFormItem>

      <ElFormItem v-if="hasNewPassword">
        <template #label>
          <span class="text-neutral-400">New Password</span>
        </template>
        <ElInput v-model="loginData.password" type="password" />
      </ElFormItem>

      <ElFormItem v-if="hasNewPassword">
        <template #label>
          <span class="text-neutral-400">Confirm New Password</span>
        </template>
        <ElInput v-model="loginData.password" type="password" />
      </ElFormItem>

      <ElFormItem v-if="hasCode">
        <template #label>
          <span class="text-neutral-400">Enter Code:</span>
        </template>
        <ElInput v-model="loginData.password" type="password" />
      </ElFormItem>
      <p
        v-if="hasCode"
        class="text-right text-xs text-neutral-400 -mt-2 cursor-pointer"
      >
        Didn't receive code?
      </p>

      <div
        v-if="['Reset', 'Enter'].includes(submitText)"
        class="flex gap-2 mt-8"
      >
        <!-- need to connect with send grid -->
        <AppButton type="primary" class="px-8" @click="submit">
          {{ submitText }}
        </AppButton>
        <SecondaryButton class="px-8" @click="router.push('/login')"
          >Go Back</SecondaryButton
        >
      </div>
      <AppButton v-else type="primary" class="w-full mt-6" @click="submit">
        {{ submitText }}
      </AppButton>

      <p
        v-if="hasPasswordConfirm"
        class="text-right text-xs text-neutral-400 mt-2 cursor-pointer"
        @click="router.push('/login')"
      >
        Have an account already? Login
      </p>
      <p
        v-if="
          !hasPasswordConfirm && !hasNewPassword && !hasCode && !hasOnlyEmail
        "
        class="text-right text-xs text-neutral-400 mt-2 cursor-pointer"
        @click="router.push('/signup')"
      >
        Don't have an account? Sign Up
      </p>
      <input type="submit" hidden />
    </ElForm>
  </ElCard>
  <div class="absolute right-0 top-[60%] -translate-y-1/2 h-[95vh] z-0">
    <ElImage src="/icons/bgc-logo.svg" class="w-full h-full" fit="contain" />
  </div>
</template>
