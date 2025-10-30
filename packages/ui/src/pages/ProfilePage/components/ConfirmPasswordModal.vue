<script setup lang="ts">
import { ref, computed } from "vue";
import { ElNotification } from "element-plus";
import authAPI from "@/api/auth";
import { isAxiosError } from "axios";

// Props and emits
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "changed"): void;
}>();

const oldPassword = ref("");
const newPassword = ref("");
const confirm = ref("");
const saving = ref(false);

const isValid = computed(() => {
  const oldOk = oldPassword.value.trim().length > 0;
  const newOk = newPassword.value.trim().length > 0;
  const match = newPassword.value === confirm.value;
  return oldOk && newOk && match;
});

async function onSubmit() {
  if (!isValid.value || saving.value) return;
  try {
    saving.value = true;
    await authAPI.changePassword({
      oldPassword: oldPassword.value.trim(),
      newPassword: newPassword.value.trim(),
    });
    ElNotification({
      title: "Password changed",
      message: "Your password has been updated.",
      type: "success",
      duration: 2500,
    });
    // reset
    oldPassword.value = "";
    newPassword.value = "";
    confirm.value = "";
    emit("changed");
    emit("update:modelValue", false);
  } catch (err: unknown) {
    interface ApiError {
      message?: string;
    }
    let message = "Failed to change password.";
    if (isAxiosError<ApiError>(err)) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;
      if (status === 401 && !serverMsg) {
        message = "Your session has expired. Please log in again.";
      } else {
        message = serverMsg || err.message || message;
      }
    }
    ElNotification({
      title: "Error",
      message,
      type: "error",
      duration: 3500,
    });
  } finally {
    saving.value = false;
  }
}

function onClose() {
  if (saving.value) return;
  emit("update:modelValue", false);
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="props.modelValue"
      class="fixed inset-0 z-[1000] flex items-center justify-center"
    >
      <div class="absolute inset-0 bg-black/30" @click="onClose"></div>

      <div class="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Change Password
        </h3>

        <div class="space-y-4">
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">Current password</label>
            <input
              v-model="oldPassword"
              type="password"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1">New password</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="Enter a new password"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-1"
              >Confirm new password</label
            >
            <input
              v-model="confirm"
              type="password"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            />
            <p
              v-if="confirm && newPassword !== confirm"
              class="text-xs text-primary-300 mt-1"
            >
              Passwords do not match.
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
            :disabled="saving"
            @click="onClose"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm bg-neutral-600 text-neutral-10 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="!isValid || saving"
            @click="onSubmit"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
